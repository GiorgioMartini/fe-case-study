import { Link } from '@tanstack/react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { User, Plus, Eye } from 'lucide-react';
import type { User as UserType } from '../api';

interface UsersListProps {
  users: UserType[];
}

export function UsersList({ users }: UsersListProps) {
  // Helper function to get initials from username
  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((name) => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const getRoleColors = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return {
          badge: 'bg-red-100 text-red-800 border-red-300',
        };
      case 'user':
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-300',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and view all users in the system
          </p>
        </div>
        <Link to="/users-create">
          <Button className="gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-md font-medium !text-black cursor-pointer">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <User className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold">No users found</h3>
              <p className="text-muted-foreground">
                Get started by creating your first user.
              </p>
            </div>
            <Link to="/users-create">
              <Button className="gap-2 bg-yellow-400 hover:bg-yellow-500 transition-colors shadow-md font-medium !text-black">
                <Plus className="h-4 w-4" />
                Create User
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Card
              key={user.id}
              className="bg-yellow-400 hover:bg-yellow-500 hover:shadow-lg transition-all duration-200 border-0 shadow-sm"
            >
              <CardHeader className="flex flex-row items-center space-y-0 space-x-4 pb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-black text-white font-semibold shadow-sm">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-lg font-bold text-black">
                    {user.username}
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-800 font-medium">
                    User ID: {user.id}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-black">Role</p>
                    <Badge
                      variant="secondary"
                      className={`capitalize font-medium ${getRoleColors(user.role).badge}`}
                    >
                      {user.role}
                    </Badge>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <Link
                    to="/users/$userId"
                    params={{ userId: user.id.toString() }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className={`w-full gap-2 transition-colors font-medium cursor-pointer`}
                    >
                      <Eye className="h-4 w-4" />
                      Edit Users
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>
              Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {users.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {users.filter((u) => u.role.toLowerCase() === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Admins</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {
                    users.filter((u) => u.role.toLowerCase() === 'moderator')
                      .length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Moderators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600">
                  {users.filter((u) => u.role.toLowerCase() === 'user').length}
                </div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
