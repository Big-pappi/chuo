import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Widget sections that can be toggled/reordered on the dashboard.
export type WidgetId =
  | 'gpaHero'
  | 'quickAccess'
  | 'upcomingClasses'
  | 'tasks'
  | 'feeStatus'
  | 'announcements'
  | 'opportunities';

export interface DashboardWidget {
  id: WidgetId;
  title: string;
  enabled: boolean;
}

interface DashboardState {
  widgets: DashboardWidget[];
  // Quick-access tile ids shown on the dashboard grid, in order.
  quickAccess: string[];
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  {id: 'gpaHero', title: 'Academic Overview', enabled: true},
  {id: 'quickAccess', title: 'Quick Access', enabled: true},
  {id: 'upcomingClasses', title: "Today's Classes", enabled: true},
  {id: 'tasks', title: 'Tasks & Deadlines', enabled: true},
  {id: 'feeStatus', title: 'Fee Status', enabled: true},
  {id: 'announcements', title: 'Latest Announcements', enabled: true},
  {id: 'opportunities', title: 'Opportunities', enabled: true},
];

const DEFAULT_QUICK_ACCESS = [
  'timetable',
  'results',
  'fees',
  'assignments',
  'attendance',
  'scholarships',
  'documents',
  'announcements',
];

const initialState: DashboardState = {
  widgets: DEFAULT_WIDGETS,
  quickAccess: DEFAULT_QUICK_ACCESS,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleWidget: (state, action: PayloadAction<WidgetId>) => {
      const w = state.widgets.find(x => x.id === action.payload);
      if (w) w.enabled = !w.enabled;
    },
    moveWidget: (state, action: PayloadAction<{id: WidgetId; direction: 'up' | 'down'}>) => {
      const {id, direction} = action.payload;
      const idx = state.widgets.findIndex(w => w.id === id);
      if (idx === -1) return;
      const swap = direction === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= state.widgets.length) return;
      [state.widgets[idx], state.widgets[swap]] = [state.widgets[swap], state.widgets[idx]];
    },
    toggleQuickAccess: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.quickAccess.includes(id)) {
        state.quickAccess = state.quickAccess.filter(x => x !== id);
      } else {
        state.quickAccess.push(id);
      }
    },
    resetDashboard: () => initialState,
  },
});

export const {toggleWidget, moveWidget, toggleQuickAccess, resetDashboard} =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
