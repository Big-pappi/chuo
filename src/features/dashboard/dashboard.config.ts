import * as SecureStore from 'expo-secure-store';

export interface DashboardWidget {
  id: string;
  type: 'gpa' | 'quickActions' | 'studentInfo' | 'upcomingClasses' | 'feeStatus' | 'notifications' | 'announcements';
  title: string;
  enabled: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
}

export interface DashboardConfig {
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  theme: 'light' | 'dark' | 'auto';
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {
    id: 'gpa',
    type: 'gpa',
    title: 'Academic Performance',
    enabled: true,
    order: 0,
    size: 'medium',
  },
  {
    id: 'quickActions',
    type: 'quickActions',
    title: 'Quick Actions',
    enabled: true,
    order: 1,
    size: 'large',
  },
  {
    id: 'studentInfo',
    type: 'studentInfo',
    title: 'Student Information',
    enabled: true,
    order: 2,
    size: 'medium',
  },
  {
    id: 'upcomingClasses',
    type: 'upcomingClasses',
    title: 'Upcoming Classes',
    enabled: true,
    order: 3,
    size: 'medium',
  },
  {
    id: 'feeStatus',
    type: 'feeStatus',
    title: 'Fee Status',
    enabled: true,
    order: 4,
    size: 'small',
  },
  {
    id: 'notifications',
    type: 'notifications',
    title: 'Notifications',
    enabled: true,
    order: 5,
    size: 'small',
  },
  {
    id: 'announcements',
    type: 'announcements',
    title: 'Announcements',
    enabled: false,
    order: 6,
    size: 'medium',
  },
];

const DEFAULT_CONFIG: DashboardConfig = {
  widgets: DEFAULT_WIDGETS,
  layout: 'grid',
  theme: 'auto',
};

// Dashboard Configuration Management
export const dashboardConfig = {
  getConfig: async (): Promise<DashboardConfig> => {
    const config = await SecureStore.getItemAsync('dashboard_config');
    if (config) {
      try {
        return JSON.parse(config);
      } catch (error) {
        console.error('Error parsing dashboard config:', error);
        return DEFAULT_CONFIG;
      }
    }
    return DEFAULT_CONFIG;
  },

  saveConfig: async (config: DashboardConfig): Promise<void> => {
    await SecureStore.setItemAsync('dashboard_config', JSON.stringify(config));
  },

  resetToDefault: async (): Promise<void> => {
    await SecureStore.setItemAsync('dashboard_config', JSON.stringify(DEFAULT_CONFIG));
  },

  getWidgets: async (): Promise<DashboardWidget[]> => {
    const config = await dashboardConfig.getConfig();
    return config.widgets
      .filter(widget => widget.enabled)
      .sort((a, b) => a.order - b.order);
  },

  updateWidget: async (widgetId: string, updates: Partial<DashboardWidget>): Promise<void> => {
    const config = await dashboardConfig.getConfig();
    const widgetIndex = config.widgets.findIndex(w => w.id === widgetId);
    
    if (widgetIndex !== -1) {
      config.widgets[widgetIndex] = {
        ...config.widgets[widgetIndex],
        ...updates,
      };
      await dashboardConfig.saveConfig(config);
    }
  },

  enableWidget: async (widgetId: string): Promise<void> => {
    await dashboardConfig.updateWidget(widgetId, { enabled: true });
  },

  disableWidget: async (widgetId: string): Promise<void> => {
    await dashboardConfig.updateWidget(widgetId, { enabled: false });
  },

  reorderWidgets: async (widgetIds: string[]): Promise<void> => {
    const config = await dashboardConfig.getConfig();
    const widgetMap = new Map(config.widgets.map(w => [w.id, w]));
    
    config.widgets = widgetIds.map((id, index) => {
      const widget = widgetMap.get(id);
      if (widget) {
        return { ...widget, order: index };
      }
      return widget;
    }).filter(Boolean) as DashboardWidget[];
    
    await dashboardConfig.saveConfig(config);
  },

  setLayout: async (layout: 'grid' | 'list'): Promise<void> => {
    const config = await dashboardConfig.getConfig();
    config.layout = layout;
    await dashboardConfig.saveConfig(config);
  },

  setTheme: async (theme: 'light' | 'dark' | 'auto'): Promise<void> => {
    const config = await dashboardConfig.getConfig();
    config.theme = theme;
    await dashboardConfig.saveConfig(config);
  },
};

export default dashboardConfig;
