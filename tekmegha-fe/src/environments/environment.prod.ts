export const environment = {
  production: true,
  supabase: {
    url: 'https://trfzoczdulcsmowxhhwi.supabase.co',
    anonKey: process.env['SUPABASE_ANON_KEY'] || ''
  }
};
