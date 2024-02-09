const express = require('express');
const supa = require('@supabase/supabase-js');
const app = express();

const supaUrl = 'https://kaagafytrleazdhwecfs.supabase.co';
const supaAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYWdhZnl0cmxlYXpkaHdlY2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc0OTk3MzMsImV4cCI6MjAyMzA3NTczM30.1Dc2y8oiIcT7LEhgVfs2GhceiHMcfrGENGLXVEmup64';

const supabase = supa.createClient(supaUrl, supaAnonKey);

app.get('/f1/status', async (req, res) => {
    const { data, error } = await supabase
        .from('status')
        .select();
    res.send(data);
});

app.get('/f1/seasons', async (req, res) => {
    const { data, error } = await supabase
        .from('seasons')
        .select();
    res.send(data);
});

app.get('/f1/races', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(` 
    raceId, year, round, circuitId, name, circuits (name,location,country) 
    `)
        .eq('year', 2020)
        .order('round', { ascending: false });
    res.send(data);
});

app.get('/f1/races/:startyear/:endyear', async (req, res) => {
    const { data, error } = await supabase
        .from('races')
        .select(` 
    * 
    `)
        .gte('year', req.params.startyear)
        .lte('year', req.params.endyear)
        .order('year', { ascending: true });
    res.send(data);
    console.log(data)
});

app.get('/f1/drivers/name/:name/limit/:limit', async (req, res) => {
    const { data, error } = await supabase
        .from('drivers')
        .select(` 
    surname
    `)

        .limit(req.params.limit)
        .like('surname', [req.params.name[0].toUpperCase() + req.params.name.substring(1) + '%'])
        .order('surname', { ascending: true });
    res.send(data);
    console.log(req.params.name[0].toUpperCase() + req.params.name.substring(1) + '%')
    console.log(data)
    console.log(error)
});

app.get('/f1/qualifying/:qualify', async (req, res) => {
    const { data, error } = await supabase
        .from('qualifying')
        .select(` 
    qualifyId, position, q1, q2, q3, races (year, name), 
    drivers (forename,surname), constructors (name) 
    `)
        .eq('qualifyId', req.params.qualify)
        .order('position', { ascending: true });
    res.send(data);
    console.log(data)
});


app.get('/f1/results/:race', async (req, res) => {
    const { data, error } = await supabase
        .from('results')
        .select(` 
    resultId, positionOrder, races (year, name), 
    drivers (forename,surname), constructors (name) 
    `)
        .eq('raceId', req.params.race)
        .order('positionOrder', { ascending: true });
    res.send(data);
});

app.listen(8080, () => {
    console.log('listening on port 8080');
    console.log('http://localhost:8080/f1/status');
}); 