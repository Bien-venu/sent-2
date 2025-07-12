
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, ShoppingCart, Users, Settings, Package, PieChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: Home, end: true },
    { to: "/admin/products", label: "Products", icon: ShoppingCart },
    { to: "/admin/orders", label: "Orders", icon: Package },
    { to: "/admin/customers", label: "Customers", icon: Users },
    { to: "/admin/sentiment", label: "Sentiment", icon: PieChart },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-semibold p-4">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
