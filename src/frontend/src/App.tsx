import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetAllReadings, useGetLatestReading } from './hooks/useQueries';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import { Badge } from './components/ui/badge';
import { Skeleton } from './components/ui/skeleton';
import { HttpLoggingInstructionsCard } from './components/HttpLoggingInstructionsCard';
import { formatTimestamp, formatValue } from './lib/format';
import { LogIn, LogOut, Activity, RefreshCw } from 'lucide-react';

function App() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const { data: allReadings, isLoading: isLoadingAll, refetch: refetchAll } = useGetAllReadings();
  const { data: latestReading, isLoading: isLoadingLatest, refetch: refetchLatest } = useGetLatestReading();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const handleManualRefresh = async () => {
    await Promise.all([refetchAll(), refetchLatest()]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-accent-foreground" />
            <h1 className="text-xl font-semibold text-foreground">Data Logger</h1>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Badge variant="outline" className="text-sm">
                  Signed In
                </Badge>
                <Button onClick={clear} variant="outline" size="sm" disabled={isLoggingIn}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Badge variant="secondary" className="text-sm">
                  Signed Out
                </Badge>
                <Button onClick={login} size="sm" disabled={isLoggingIn || loginStatus === 'logging-in'}>
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* HTTP Logging Instructions */}
          <HttpLoggingInstructionsCard />

          {/* Latest Reading Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Reading</CardTitle>
                  <CardDescription>Most recent data point captured</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoadingLatest}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingLatest ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingLatest ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ) : latestReading ? (
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-foreground">{formatValue(latestReading.value)}</div>
                  <div className="text-sm text-muted-foreground">{formatTimestamp(latestReading.timestamp)}</div>
                </div>
              ) : (
                <div className="text-muted-foreground">No readings available yet</div>
              )}
            </CardContent>
          </Card>

          {/* All Readings Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Readings</CardTitle>
                  <CardDescription>Complete history of captured data points (auto-refreshes every 3 seconds)</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManualRefresh}
                  disabled={isLoadingAll}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAll ? 'animate-spin' : ''}`} />
                  Refresh Now
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAll ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : allReadings && allReadings.length > 0 ? (
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">ID</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allReadings.map((reading) => (
                        <TableRow key={reading.id.toString()}>
                          <TableCell className="font-medium">{reading.id.toString()}</TableCell>
                          <TableCell className="font-mono">{formatValue(reading.value)}</TableCell>
                          <TableCell className="text-muted-foreground">{formatTimestamp(reading.timestamp)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No readings available yet</div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2026. Built with love using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
