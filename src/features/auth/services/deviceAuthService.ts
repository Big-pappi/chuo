import * as Crypto from 'expo-crypto';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_HASH_KEY = 'device_pin_hash';
const PIN_SALT_KEY = 'device_pin_salt';
const BIOMETRIC_ENABLED_KEY = 'device_biometric_enabled';

const createSalt = () => Crypto.getRandomBytesAsync(16).then(bytes =>
  Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join(''),
);

const hashPin = (pin: string, salt: string) =>
  Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);

class DeviceAuthService {
  async isPinConfigured(): Promise<boolean> {
    return Boolean(await SecureStore.getItemAsync(PIN_HASH_KEY));
  }

  async setPin(pin: string): Promise<void> {
    if (!/^\d{4,6}$/.test(pin)) throw new Error('PIN must contain 4 to 6 digits.');
    const salt = await createSalt();
    const digest = await hashPin(pin, salt);
    await SecureStore.setItemAsync(PIN_SALT_KEY, salt);
    await SecureStore.setItemAsync(PIN_HASH_KEY, digest);
  }

  async verifyPin(pin: string): Promise<boolean> {
    const [salt, stored] = await Promise.all([
      SecureStore.getItemAsync(PIN_SALT_KEY),
      SecureStore.getItemAsync(PIN_HASH_KEY),
    ]);
    if (!salt || !stored) return false;
    return (await hashPin(pin, salt)) === stored;
  }

  async removePin(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(PIN_HASH_KEY),
      SecureStore.deleteItemAsync(PIN_SALT_KEY),
    ]);
  }

  async biometricAvailability(): Promise<{available: boolean; enrolled: boolean}> {
    const [available, enrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return {available, enrolled};
  }

  async setBiometricEnabled(enabled: boolean): Promise<void> {
    if (enabled) {
      const status = await this.biometricAvailability();
      if (!status.available || !status.enrolled) {
        throw new Error('Set up Face ID or fingerprint on this device first.');
      }
    }
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, String(enabled));
  }

  async isBiometricEnabled(): Promise<boolean> {
    return (await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY)) === 'true';
  }

  async authenticateBiometric(): Promise<boolean> {
    if (!(await this.isBiometricEnabled())) return false;
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock ChuoApp',
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    });
    return result.success;
  }
}

export default new DeviceAuthService();
