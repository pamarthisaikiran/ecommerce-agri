// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rdotingdflwbvuuhkprj.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb3RpbmdkZmx3YnZ1dWhrcHJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjYxNDQ3MzUsImV4cCI6MjA0MTcyMDczNX0.4bD0pIZvmFGZI3ZmTVVeXgt9pkd6SoCBsLYx3_K0qXk'; // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseKey);
