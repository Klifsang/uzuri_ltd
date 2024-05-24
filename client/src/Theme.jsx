import React, { useContext, useState } from 'react'

const ThemeContext=React.createContext()               
const UpdateThemeContext=React.createContext()

export function UseTheme(){              
    return useContext(ThemeContext)
}
export function UpdateTheme(){             
    return useContext(UpdateThemeContext)
}
//function theme
function ThemeProvider({children}) {
    const [darkTheme, setDarkTheme]=useState(true)  //set state for the theme

    const toggleColor=()=>{       
        setDarkTheme(prevTheme=>!prevTheme)
    }
  return (
    <div>
    {/* theme providers */}
      <ThemeContext.Provider value={darkTheme}>
        <UpdateThemeContext.Provider value={toggleColor}>      
            {children}
        </UpdateThemeContext.Provider>
      </ThemeContext.Provider>
    </div>
  )
}

export default ThemeProvider
