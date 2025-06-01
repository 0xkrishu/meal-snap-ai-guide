
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  return (
    <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FL</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FoodLens AI</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                location.pathname === "/dashboard" ? "text-green-600" : "text-gray-600"
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/history" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                location.pathname === "/history" ? "text-green-600" : "text-gray-600"
              }`}
            >
              History
            </Link>
            {user && (
              <span className="text-sm text-gray-600">{user.email}</span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
