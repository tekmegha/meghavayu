export const environment = {
  production: false,
  supabase: {
    url: 'https://trfzoczdulcsmowxhhwi.supabase.co',
    anonKey: process.env['SUPABASE_ANON_KEY'] || ''
  }
};
