export type Branded<T, Brand> = T & {__brand: Brand}

export type Updatable<T> = Branded<T, "Updatable">