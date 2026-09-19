# Ochtendkring

Een gedeelde webapp voor het voorbereiden en opvolgen van de dagelijkse ochtendkring met collega's.

## Functies
- Dagkiezer en navigatie per dag
- Bespreekpunten met notities na de bespreking
- Bespreekpunten markeren als **Besproken ✓** zonder ze te verwijderen
- Items om gewoon te lezen
- 1-op-1 syncpunten
- Leerlingmededelingen met doelgroep: Iedereen, 1e, 2e of 3e graad
- Filter op doelgroep
- Google-login via Supabase Auth
- Gedeelde opslag in Supabase
- Realtime updates tussen collega's
- Weekoverzicht
- Demo-modus zolang Supabase nog niet is ingesteld

## Online zetten zonder maandelijkse kosten
De app kan als statische website op GitHub Pages, Netlify of Vercel staan. De database en Google-login kunnen via het gratis Supabase-plan lopen zolang het gebruik binnen de gratis limieten blijft.

### Supabase instellen
1. Maak een project op Supabase.
2. Open SQL Editor en voer `schema.sql` volledig uit.
3. Ga naar Authentication > Providers > Google en schakel Google in.
4. Maak in Google Cloud een OAuth client aan volgens de Supabase-documentatie.
5. Voeg in Supabase bij Authentication > URL Configuration de URL van je website toe als Site URL en redirect URL.
6. Vul in `index.html` de twee waarden in:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
7. Publiceer de map op GitHub Pages, Netlify of Vercel.

### Belangrijk
Gebruik nooit de Supabase `service_role` key in deze webapp. Alleen de publieke `anon` key hoort in `index.html`.


## Huidige productieversie

Deze versie gebruikt de bestaande Supabase-tabellen `discussion_items`, `reading_items`,
`sync_items` en `announcements`. Het bestand `schema.sql` uit een oudere versie is daarom
bewust niet opgenomen in deze deploybare versie.

De doelgroepknoppen in de interface gebruiken `all/first/second/third`, terwijl Supabase
voor `announcements.audience` `allen/eerste/tweede/derde` verwacht. De vertaling tussen
beide waarden gebeurt in `index.html`.
