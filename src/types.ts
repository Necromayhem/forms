export interface Tag {
	text: string
}

export interface User {
	id: number
	tags: Tag[]
	type: string
	login: string
	password: string | null
	errors: {
		login?: string
		password?: string
	}
}
