// features/course-search/ui/course-search.tsx
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/input';
import { Search, X } from 'lucide-react';
import { contentApi } from '@/entities/content/api';
import { QueryKeys } from '@/shared/lib/query-keys';
import { CourseSearchResult } from './course-search-result';
import { Spinner } from '@/shared/ui/spinner';

export const CourseSearch = () => {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null)

    const { data: courses, isLoading } = useQuery({
        queryKey: QueryKeys.courseSearch(query),
        queryFn: () => contentApi.searchCourses(query),
        enabled: query.length >= 2,
    })


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (courseId: string) => {
        setQuery('')
        setIsOpen(false)
        navigate(`/course/${courseId}`)
    }

    return (
        <div ref={containerRef} className="hidden md:flex items-center relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Поиск курсов..."
                className="pl-9 bg-muted"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
            />
            {query && 
                <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
            }

            {isOpen && query.length >= 2 && 
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isLoading 
                        ?   <div className="p-4 text-center">
                                <Spinner  />
                            </div>
                        :   courses?.length === 0 
                            ?    <div className="p-4 text-center text-muted-foreground">
                                    Ничего не найдено
                                </div>
                            :   <div className="py-2">
                                    {courses?.map((course) => (
                                        <CourseSearchResult
                                            key={course.id}
                                            course={course}
                                            onSelect={() => handleSelect(course.id)}
                                        />
                                    ))}
                                </div>
                    }
                </div>
            }
        </div>
    )
}