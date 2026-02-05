import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from './ui/alert';

export function HttpLoggingInstructionsCard() {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [backendCanisterId, setBackendCanisterId] = useState<string>('');
  
  useEffect(() => {
    // Get backend canister ID from environment
    const canisterId = 
      import.meta.env.VITE_CANISTER_ID_BACKEND ||
      import.meta.env.CANISTER_ID_BACKEND ||
      (window as any).CANISTER_ID_BACKEND ||
      '';
    setBackendCanisterId(canisterId);
  }, []);

  // Backend canister raw HTTP URLs (JSON endpoints)
  const backendBaseUrl = backendCanisterId ? `https://${backendCanisterId}.raw.icp0.io` : '';
  const backendLogUrl = backendBaseUrl ? `${backendBaseUrl}/log?value=2.1` : '';
  const backendReadingsUrl = backendBaseUrl ? `${backendBaseUrl}/readings` : '';
  const backendDataUrl = backendBaseUrl ? `${backendBaseUrl}/data` : '';
  
  // Reference URL (known to return HTML, not JSON)
  const referenceUrl = 'https://simple-data-logging-web-app-with-motoko-http-endpo-d3a.caffeine.xyz/log?value=2.1';

  const handleCopy = async (url: string, label: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(label);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!backendCanisterId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>HTTP Logging API</CardTitle>
          <CardDescription>
            Log data from any device or application using simple HTTP requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Backend canister ID not found. Please ensure the backend is deployed.
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

        {/* Reference URL Note */}
        <div className="pt-3 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Reference (Non-JSON URL)</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The following URL returns HTML (the frontend app), not JSON. Use the URLs above for API access:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-md bg-muted/50 text-sm font-mono break-all text-muted-foreground">
              {referenceUrl}
            </code>
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
