-- Aktiver RLS for storage.objects tabellen
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Opprett policy for å tillate alle å lese filer i profile-images bucketen
CREATE POLICY "Alle kan lese profilbilder" ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');

-- Opprett policy for å tillate autentiserte brukere å laste opp filer til profile-images bucketen
CREATE POLICY "Autentiserte brukere kan laste opp profilbilder" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Opprett policy for å tillate autentiserte brukere å oppdatere filer i profile-images bucketen
CREATE POLICY "Autentiserte brukere kan oppdatere profilbilder" ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images');

-- Opprett policy for å tillate autentiserte brukere å slette filer i profile-images bucketen
CREATE POLICY "Autentiserte brukere kan slette profilbilder" ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');

-- Alternativ policy som tillater alle operasjoner for autentiserte brukere
-- CREATE POLICY "Autentiserte brukere har full tilgang til profilbilder" ON storage.objects
-- TO authenticated
-- USING (bucket_id = 'profile-images')
-- WITH CHECK (bucket_id = 'profile-images'); 