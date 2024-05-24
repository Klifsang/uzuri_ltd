import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../UserContext';

const Item = ({ title, to, icon }) => {
  return (
    <Link to={to}>
      <MenuItem className="text-black hover:text-gray-600" icon={icon}>
        <h4 className="text-xl text-gray-400 hover:text-gray-600">{title}</h4>
      </MenuItem>
    </Link>
  );
};

function SideBar({ toggleColor, darkTheme }) {
  const [isCollapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

//   const ThemeStyles = {
//     backgroundColor: darkTheme ? "#282A36" : "#E0E0E0",
//     color: darkTheme ? "#FFFFFF" : "#000000"
// };

const ThemeStyles = {
  backgroundColor: darkTheme ? "#282A36" : "#D3D3D3",
  color: darkTheme ? "#FFFFFF" : "#000000"
};

  
//   const MenuStyles = {
//     backgroundColor: darkTheme ? "#282A36" : "#E0E0E0"
// };

const MenuStyles = {
    backgroundColor: darkTheme ? "#282A36" : "#D3D3D3"
};

 

  const handleLogout = () => {
    navigate("/home");
  };

  return (
    <div className="flex-col w-fit h-screen" style={ThemeStyles}>
      <Box className="flex-col" style={ThemeStyles}>
        <Sidebar collapsed={isCollapsed} style={ThemeStyles}>
          <Menu style={MenuStyles}>
            <Box>
              <MenuItem
                className="py-2 text-slate-700 justify-between hover:text-gray-600"
                onClick={() => setCollapsed(!isCollapsed)}
                icon={isCollapsed ? <MenuIcon /> : undefined}
                style={{ margin: "10px 0", cursor: "pointer" }}
              >
                {!isCollapsed && (
                  <Box className="flex justify-between p-3">
                    <h1 className={`text-2xl font-bold ${darkTheme ? 'text-gray-400' : 'text-gray-900'}`}>UZURI LIMITED</h1>
                    <IconButton
                      className="text-slate-400 hover:text-gray-600"
                      onClick={() => setCollapsed(!isCollapsed)}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Box>
                )}
              </MenuItem>
            </Box>
            {!isCollapsed && (
              <Box>
                <Box className="mt-3 text-center">
                  {user ? (
                    <>
                      <h1 className={`text-2xl font-bold ${darkTheme ? 'text-white' : 'text-black'}`}>
                        {user.name}
                      </h1>
                      <h5 className={`text-xl font-bold ${darkTheme ? 'text-gray-400' : 'text-gray-900'}`}>
                        {user.role || "Admin"}
                      </h5>
                    </>
                  ) : (
                    <h5 className={`text-xl font-bold ${darkTheme ? 'text-gray-400' : 'text-gray-900'}`}>
                      Admin
                    </h5>
                  )}
                </Box>
              </Box>
            )}
          </Menu>
          <Menu className="mt-4" style={MenuStyles}>
            <Box className="text-gray-300">
              <Item icon={<HomeIcon />} title="Home" to="/Home" />
            </Box>
          </Menu>
          {/* <Menu className="mt-auto" style={MenuStyles}>
            <Box className="flex items-center justify-center py-3">
              <IconButton onClick={handleLogout} className="text-black hover:text-gray-600">
                <ExitToAppIcon className="text-2xl" />
                {!isCollapsed && (
                  <span className={`ml-2 ${darkTheme ? 'text-gray-400 font-bold' : 'text-black'}`}>Logout</span>
                )}
              </IconButton>
            </Box>
          </Menu> */}
        </Sidebar>
      </Box>
    </div>
  );
}

export default SideBar;
