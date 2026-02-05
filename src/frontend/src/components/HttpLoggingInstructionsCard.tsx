import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { getBackendCanisterIdSync, resolveBackendCanisterId, getConfigDiagnostics } from '../lib/runtimeConfig';

export function HttpLoggingInstructionsCard() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [backendCanisterId, setBackendCanisterId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [configFailed, setConfigFailed] = useState(false);

  useEffect(() => {
    // Try to resolve backend canister ID
    const loadConfig = async () => {
      setIsLoading(true);
      const config = await resolveBackendCanisterId();
      setBackendCanisterId(config.backendCanisterId || '');
      setConfigFailed(!config.backendCanisterId);
      setIsLoading(false);
    };

    loadConfig();
  }, []);

  // Backend canister raw HTTP URLs (JSON endpoints)
  const backendBaseUrl = backendCanisterId ? `https://${backendCanisterId}.raw.icp0.io` : '';
  const backendLogUrl = backendBaseUrl ? `${backendBaseUrl}/log?value=2.1` : '';
  const backendReadingsUrl = backendBaseUrl ? `${backendBaseUrl}/readings` : '';
  const backendDataUrl = backendBaseUrl ? `${backendBaseUrl}/data` : '';

  const handleCopy = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(label);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HTTP Logging API</CardTitle>
          <CardDescription>
            Log data from any device or application using simple HTTP requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!backendCanisterId || configFailed) {
    const diagnostics = getConfigDiagnostics();
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>HTTP Logging API</CardTitle>
          <CardDescription>
            Log data from any device or application using simple HTTP requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-semibold">Configuration Loading Failed</p>
              <p className="text-sm">
                Unable to load the backend canister configuration. This may happen if the application
                configuration is not yet available.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Hard Refresh
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                If this persists after refreshing, the backend may need to be redeployed.
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HTTP Logging API</CardTitle>
        <CardDescription>
          Log data from any device or application using simple HTTP requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Important Note */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Note:</strong> After logging a reading via HTTP, it will appear in the table below after the next automatic refresh (every 3 seconds), or you can use the manual refresh button.
          </AlertDescription>
        </Alert>

        {/* Log Endpoint */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Log a Reading</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Send a GET request with a <code className="px-1.5 py-0.5 rounded bg-muted text-xs">value</code> parameter to log a new data point:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono break-all">
              {backendLogUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(backendLogUrl, 'log')}
              className="shrink-0"
            >
              {copiedUrl === 'log' ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <a href={backendLogUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Readings Endpoint */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Retrieve All Readings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get all logged readings as JSON:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono break-all">
              {backendReadingsUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(backendReadingsUrl, 'readings')}
              className="shrink-0"
            >
              {copiedUrl === 'readings' ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <a href={backendReadingsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Alternative Data Endpoint */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Alternative: Retrieve via /data</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Same data, alternative endpoint:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono break-all">
              {backendDataUrl}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(backendDataUrl, 'data')}
              className="shrink-0"
            >
              {copiedUrl === 'data' ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="shrink-0"
            >
              <a href={backendDataUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        {/* Backend Canister ID */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Backend Canister ID</h3>
            <p className="text-sm text-muted-foreground mb-3">
              The backend canister identifier:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted text-sm font-mono break-all">
              {backendCanisterId}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(backendCanisterId, 'canister-id')}
              className="shrink-0"
            >
              {copiedUrl === 'canister-id' ? (
                <span className="text-xs">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="pt-3 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Example Usage</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Browser:</strong> Simply visit the URL in your browser
            </p>
            <p>
              <strong className="text-foreground">ESP32/Arduino:</strong> Use HTTPClient library to make GET requests
            </p>
            <p>
              <strong className="text-foreground">Python:</strong> <code className="px-1.5 py-0.5 rounded bg-muted text-xs">requests.get(url)</code>
            </p>
            <p>
              <strong className="text-foreground">cURL:</strong> <code className="px-1.5 py-0.5 rounded bg-muted text-xs">curl "{backendLogUrl}"</code>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
