/**
* Spotgue Core Helper for Managing File Cache
* wrap react native cache implementation and hide from Spotgue UI App
* @format 
* @flow 
* 1. manage cache file scope : image/icon, video, sound
* 2. getImageFile (from file cache or fetch from server URL if not available and callback event once done)
* 3. getSoundFile (from file cache or fetch from server URL if not available and callback event once done)
* 4. getVideoFile (from file cache or fetch from server URL if not available and callback event once done)
* 5. track usage statistic of all cached file (create date, last call, last login, number of calls)
* 6. manage cache size per capacity allocated x MB by performing auto clear of unused cache, via background job or when app closed
* 7. clear cache
*/

