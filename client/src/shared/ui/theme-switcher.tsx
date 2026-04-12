import '../styles/theme-switcher.css'

export type Theme = "light" | "dark"

export const ThemeSwitcher = () => {

    const toggleTheme = () => {
        if (localStorage.getItem('theme') === 'dark') {
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
            return
        }

        localStorage.setItem('theme', "dark")
        document.documentElement.classList.add('dark')
    }
    
    return(
        <>
            <div>
                <div className={"relative h-8 w-16 theme__switcher"} onClick={toggleTheme}>
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
            </div>
        </>
    )
}