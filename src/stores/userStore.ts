import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Tag } from '../types'

export const useUserStore = defineStore('users', () => {
	const users = ref<User[]>(JSON.parse(localStorage.getItem('users') || '[]'))
	const recordTypes = ref([
		{ label: 'LDAP', value: 'LDAP' },
		{ label: 'Локальная', value: 'Локальная' },
	])

	function saveToLocalStorage() {
		const validUsers = users.value.filter(user => {
			return validateUser(user, false)
		})
		localStorage.setItem('users', JSON.stringify(validUsers))
	}

	function validateUser(user: User, saveErrors = true): boolean {
		const errors: User['errors'] = {}
		let isValid = true

		if (!user.login || user.login.length > 100) {
			errors.login = 'Логин обязателен (макс. 100 символов)'
			isValid = false
		}

		if (
			user.type === 'Локальная' &&
			(!user.password || user.password.length > 100)
		) {
			errors.password = 'Пароль обязателен (макс. 100 символов)'
			isValid = false
		}

		if (saveErrors) {
			user.errors = errors
		}

		return isValid
	}

	function addUser() {
		const newUser: User = {
			id: Date.now(),
			tags: [],
			type: 'LDAP',
			login: '',
			password: null,
			errors: {},
		}
		users.value.push(newUser)
	}

	function deleteUser(id: number) {
		users.value = users.value.filter(user => user.id !== id)
		saveToLocalStorage()
	}

	function updateUser(id: number, updatedData: Partial<User>) {
		const index = users.value.findIndex(user => user.id === id)
		if (index !== -1) {
			users.value[index] = { ...users.value[index], ...updatedData }
			saveToLocalStorage()
		}
	}

	function updateTags(id: number, tagsString: string) {
		const tagsArray = tagsString
			.split(';')
			.map(tag => tag.trim())
			.filter(tag => tag.length > 0 && tag.length <= 50)
			.map(tag => ({ text: tag }) as Tag)

		updateUser(id, { tags: tagsArray })
	}

	return {
		users,
		recordTypes,
		addUser,
		deleteUser,
		updateUser,
		updateTags,
		validateUser,
		saveToLocalStorage,
	}
})
