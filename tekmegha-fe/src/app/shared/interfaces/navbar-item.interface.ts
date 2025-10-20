export interface NavbarItem {
  icon?: string;
  label?: string;
  route?: string;
  position?: 'left' | 'center' | 'right';
  active?: boolean;
  disabled?: boolean;
  action?: 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart';
}
