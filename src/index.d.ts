declare module EnRegExp {
    class EnRegExp extends RegExp {
        constructor(pattern: string | RegExp, flags: String) {
            super(pattern, flags)
        }

        static array(regex: EnRegExp): Array
    }
}