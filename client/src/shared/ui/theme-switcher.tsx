import { useTheme } from '../providers/theme-provider'
import '../styles/theme-switcher.css'

export const ThemeSwitcher = () => {
    const {theme, toggleDarkTheme, toggleLightTheme} = useTheme()

    return(
        <div 
            className={"relative h-8 w-16 theme__switcher"} 
            onClick={() => theme === 'dark'
                ?   toggleLightTheme()
                :   toggleDarkTheme()
            }
        >
            <div className="border rounded-[8rem]">
                <img
                    src="/images/Day.jpeg"
                    className='rounded-[8rem] w-16 h-8 theme__image__light'
                />
                <img
                    src="/images/Night.jpg"
                    className='rounded-[8rem] w-16 h-8 hidden theme__image__dark'
                />
            </div>
            <div
                style={{transition: 'all .5s ease'}}
                className={`
                        absolute w-5 h-5 rounded-[50%] top-1.5 border
                        ml-9 bg-amber-300 theme__switcher__cursor
                    `}
            />
        </div>
    )
}