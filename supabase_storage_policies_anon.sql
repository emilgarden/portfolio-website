-- ADVARSEL: Disse policyene tillater anonym tilgang og bør kun brukes for testing
-- I produksjon bør du bruke mer restriktive policies

-- Aktiver RLS for storage.objects tabellen
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Opprett policy for å tillate alle (inkludert anonyme) å lese filer i profile-images bucketen
CREATE POLICY "Alle kan lese profilbilder" ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Opprett policy for å tillate alle (inkludert anonyme) å laste opp filer til profile-images bucketen
-- KUN FOR TESTING - IKKE BRUK I PRODUKSJON
CREATE POLICY "Alle kan laste opp profilbilder (testing)" ON storage.objects FOR INSERT
USING (bucket_id = 'profile-images')
WITH CHECK (bucket_id = 'profile-images');

-- Opprett policy for å tillate alle (inkludert anonyme) å oppdatere filer i profile-images bucketen
-- KUN FOR TESTING - IKKE BRUK I PRODUKSJON
CREATE POLICY "Alle kan oppdatere profilbilder (testing)" ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images');

-- Opprett policy for å tillate alle (inkludert anonyme) å slette filer i profile-images bucketen
-- KUN FOR TESTING - IKKE BRUK I PRODUKSJON
CREATE POLICY "Alle kan slette profilbilder (testing)" ON storage.objects FOR DELETE
USING (bucket_id = 'profile-images');

-- Alternativ policy som tillater alle operasjoner for alle brukere
-- KUN FOR TESTING - IKKE BRUK I PRODUKSJON
-- CREATE POLICY "Alle har full tilgang til profilbilder (testing)" ON storage.objects
-- USING (bucket_id = 'profile-images')
-- WITH CHECK (bucket_id = 'profile-images'); 