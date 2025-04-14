<!-- Web Application Manifest -->
{{-- <link rel="manifest" href="{{ url('manifest.json') }}"> --}}
<link rel="manifest" crossorigin="use-credentials" href="/manifest.json">

<!-- Chrome for Android theme color -->
<meta name="theme-color" content="{{ config('laravelpwa.manifest.theme_color') }}">

<!-- Add to homescreen for Chrome on Android -->
<meta name="mobile-web-app-capable"
  content="{{ config('laravelpwa.manifest.display') == 'standalone' ? 'yes' : 'no' }}">
<meta name="application-name" content="{{ config('laravelpwa.manifest.short_name') }}">
<link rel="icon" sizes="{{ key(config('laravelpwa.manifest.icons')) }}"
  href="{{ config('laravelpwa.manifest.icons.' . key(config('laravelpwa.manifest.icons')) . '.path') }}">

<!-- Add to homescreen for Safari on iOS -->
<meta name="apple-mobile-web-app-capable"
  content="{{ config('laravelpwa.manifest.display') == 'standalone' ? 'yes' : 'no' }}">
<meta name="apple-mobile-web-app-status-bar-style"
  content="{{ config('laravelpwa.manifest.status_bar') }}">
<meta name="apple-mobile-web-app-title" content="{{ config('laravelpwa.manifest.short_name') }}">
<link rel="apple-touch-icon" href="{{ config('laravelpwa.manifest.icons.192x192.path') }}">

<!-- Splash Screens -->
@foreach (config('laravelpwa.manifest.splash') as $size => $url)
  <link href="{{ $url }}" media="(device-width: {{ $size }})"
    rel="apple-touch-startup-image" />
@endforeach

<!-- Tile for Win8 -->
<meta name="msapplication-TileColor"
  content="{{ config('laravelpwa.manifest.background_color') }}">
<meta name="msapplication-TileImage"
  content="{{ config('laravelpwa.manifest.icons.192x192.path') }}">
