import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fiupwvxxwclcaajayqwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdXB3dnh4d2NsY2FhamF5cXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjAzNzI0MDUsImV4cCI6MjAzNTk0ODQwNX0.NCi9tb6zc8R6YOxty2K_NVzmmTgHnF8QmHHqCR8_2Is';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);