// Payload migrations load an older undici through tsx. Node 22 exposes the
// browser CacheStorage globals by default, which makes that undici version
// throw "Illegal constructor" during startup. Remove the conflicting globals
// before Payload loads its migration runner.
for (const key of ["CacheStorage", "Cache", "caches"]) {
  try {
    delete globalThis[key];
  } catch {
    // Ignore runtimes where the global is non-configurable.
  }
}
