export interface NavbarItem {
  icon?: string;
  label?: string;
  route?: string;
  position?: 'left' | 'center' | 'right';
  active?: boolean;
  action?: 'toggleMenu' | 'openSearch';
}
