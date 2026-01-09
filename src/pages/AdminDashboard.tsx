import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Film, Crown, BarChart3, Settings,
  Plus, Search, MoreVertical, Edit, Trash2, Eye, TrendingUp,
  DollarSign, Play, Clock, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Mock data for admin
const mockUsers = [
  { id: '1', username: 'otaku_master', email: 'otaku@example.com', isPremium: true, joinedAt: '2024-01-15', watchTime: '124h' },
  { id: '2', username: 'anime_lover', email: 'lover@example.com', isPremium: false, joinedAt: '2024-02-20', watchTime: '45h' },
  { id: '3', username: 'donghua_fan', email: 'fan@example.com', isPremium: true, joinedAt: '2024-03-10', watchTime: '89h' },
  { id: '4', username: 'casual_viewer', email: 'casual@example.com', isPremium: false, joinedAt: '2024-04-05', watchTime: '12h' },
  { id: '5', username: 'binge_watcher', email: 'binge@example.com', isPremium: true, joinedAt: '2024-05-01', watchTime: '256h' },
];

const mockAnimeList = [
  { id: '1', title: 'Jujutsu Kaisen S2', episodes: 23, views: 125000, status: 'completed' },
  { id: '2', title: 'Solo Leveling', episodes: 12, views: 98000, status: 'ongoing' },
  { id: '3', title: 'Frieren', episodes: 28, views: 156000, status: 'completed' },
  { id: '4', title: 'Blue Lock S2', episodes: 4, views: 45000, status: 'ongoing' },
  { id: '5', title: 'Battle Through Heavens', episodes: 156, views: 234000, status: 'ongoing' },
];

const stats = {
  totalUsers: 12450,
  premiumUsers: 2340,
  totalAnime: 856,
  totalViews: 4500000,
  monthlyRevenue: 23400,
  activeToday: 1234,
};

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user is admin (mock)
  const isAdmin = true; // Replace with actual admin check

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">You don't have permission to access the admin dashboard.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-card border-r border-border hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">A</span>
              </div>
              <div>
                <span className="font-bold text-lg">AniCrew</span>
                <p className="text-xs text-muted-foreground">Admin Panel</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'users' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'content' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <Film className="w-5 h-5" />
              Content
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'subscriptions' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <Crown className="w-5 h-5" />
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Link to="/settings">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="w-5 h-5" />
                Settings
              </Button>
            </Link>
            <Link to="/">
              <Button variant="ghost" className="w-full justify-start gap-3 mt-2">
                <ChevronRight className="w-5 h-5" />
                Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your anime streaming platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px] sm:w-[300px]"
              />
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Anime
            </Button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="overview"><LayoutDashboard className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="users"><Users className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="content"><Film className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="subscriptions"><Crown className="w-4 h-4" /></TabsTrigger>
              <TabsTrigger value="analytics"><BarChart3 className="w-4 h-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-blue-500/20">
                      <Users className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-amber-500/20">
                      <Crown className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Premium</p>
                      <p className="text-2xl font-bold">{stats.premiumUsers.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-purple-500/20">
                      <Film className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Anime</p>
                      <p className="text-2xl font-bold">{stats.totalAnime.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-green-500/20">
                      <Play className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{(stats.totalViews / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-emerald-500/20">
                      <DollarSign className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-rose-500/20">
                      <Clock className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Today</p>
                      <p className="text-2xl font-bold">{stats.activeToday.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUsers.slice(0, 4).map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <span className="font-semibold">{user.username[0].toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        {user.isPremium && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Premium</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Content</CardTitle>
                  <CardDescription>Most viewed anime this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAnimeList.slice(0, 4).map((anime, index) => (
                      <div key={anime.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-muted-foreground w-8">
                            #{index + 1}
                          </span>
                          <div>
                            <p className="font-medium">{anime.title}</p>
                            <p className="text-sm text-muted-foreground">{anime.episodes} episodes</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-green-500">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-medium">{(anime.views / 1000).toFixed(0)}k</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Watch Time</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.isPremium ? (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">Premium</Badge>
                        ) : (
                          <Badge variant="secondary">Free</Badge>
                        )}
                      </TableCell>
                      <TableCell>{user.watchTime}</TableCell>
                      <TableCell>{user.joinedAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success('Premium granted!')}>
                              <Crown className="w-4 h-4 mr-2" />
                              Grant Premium
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage anime and donghua content</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Episodes</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnimeList.map((anime) => (
                    <TableRow key={anime.id}>
                      <TableCell className="font-medium">{anime.title}</TableCell>
                      <TableCell>{anime.episodes}</TableCell>
                      <TableCell>{anime.views.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={anime.status === 'ongoing' ? 'default' : 'secondary'}>
                          {anime.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Episode
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Crown className="w-12 h-12 mx-auto mb-4 text-amber-500" />
                  <h3 className="text-2xl font-bold">{stats.premiumUsers}</h3>
                  <p className="text-muted-foreground">Active Subscriptions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-2xl font-bold">${stats.monthlyRevenue}</h3>
                  <p className="text-muted-foreground">Monthly Revenue</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="text-2xl font-bold">18.7%</h3>
                  <p className="text-muted-foreground">Conversion Rate</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Premium Subscribers</CardTitle>
                <CardDescription>Users with active premium subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.filter(u => u.isPremium).map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
                            Premium Monthly
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinedAt}</TableCell>
                        <TableCell>2026-02-15</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Overview</CardTitle>
                <CardDescription>Platform performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-lg bg-muted/30">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Analytics charts will be displayed here</p>
                    <p className="text-sm text-muted-foreground mt-2">Connect to Lovable Cloud for real analytics data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
