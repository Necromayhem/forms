<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useToast } from 'primevue/usetoast'
import { useUserStore } from './stores/userStore'
import type { Tag, User } from './types'

const userStore = useUserStore()
const toast = useToast()

const getTagsString = (tags: Tag[]): string => {
	return tags.map((tag: Tag) => tag.text).join('; ')
}

const handleTagsUpdate = (id: number, value?: string) => {
	if (value !== undefined) {
		userStore.updateTags(id, value)
	}
}

const passwordVisible = ref<Record<number, boolean>>({})

const togglePasswordVisibility = (id: number) => {
	passwordVisible.value[id] = !passwordVisible.value[id]
}

const handleValidation = (user: User) => {
	const isValid = userStore.validateUser(user)
	if (!isValid) {
		toast.add({
			severity: 'error',
			summary: 'Ошибка валидации',
			detail: 'Пожалуйста, проверьте введенные данные',
			life: 3000,
		})
		return false
	}
	userStore.saveToLocalStorage()
	return true
}
</script>

<template>
	<Toast position="top-right" />
	<div class="header">
		<h2>Учётные записи</h2>
		<Button icon="pi pi-plus" size="large" @click="userStore.addUser" />
	</div>

	<div v-if="userStore.users.length > 0" class="table-container">
		<DataTable
			:value="userStore.users"
			:paginator="true"
			:rows="10"
			class="fixed-width-table"
		>
			<Column header="Метки" style="width: 25%">
				<template #body="{ data }">
					<div class="input-container">
						<InputText
							:modelValue="getTagsString(data.tags)"
							@update:modelValue="
								(value: string | undefined) => handleTagsUpdate(data.id, value)
							"
							placeholder="Введите метки через ;"
							:class="{
								'p-invalid': data.tags.some((tag: Tag) => tag.text.length > 50),
							}"
						/>
					</div>
				</template>
			</Column>

			<Column header="Тип записи" style="width: 15%">
				<template #body="{ data }">
					<div class="input-container">
						<Dropdown
							style="width: 80%"
							v-model="data.type"
							:options="userStore.recordTypes"
							optionLabel="label"
							optionValue="value"
							@change="userStore.saveToLocalStorage"
							placeholder="Выберите тип"
							:class="{ 'p-invalid': !data.type }"
						/>
					</div>
				</template>
			</Column>

			<Column header="Логин" style="width: 20%">
				<template #body="{ data }">
					<div class="input-container">
						<InputText
							v-model="data.login"
							@blur="handleValidation(data)"
							placeholder="Введите логин"
							:class="{ 'p-invalid': data.errors.login }"
						/>
					</div>
				</template>
			</Column>

			<Column header="Пароль" style="width: 20%">
				<template #body="{ data }">
					<div class="input-container">
						<InputGroup v-if="data.type !== 'LDAP'">
							<InputText
								v-model="data.password"
								:type="passwordVisible[data.id] ? 'text' : 'password'"
								@blur="handleValidation(data)"
								placeholder="Введите пароль"
								:class="{ 'p-invalid': data.errors.password }"
							/>
							<InputGroupAddon>
								<Button
									:icon="
										passwordVisible[data.id] ? 'pi pi-eye-slash' : 'pi pi-eye'
									"
									@click="togglePasswordVisibility(data.id)"
									class="p-button-text"
								/>
							</InputGroupAddon>
						</InputGroup>
						<InputText
							v-else
							type="password"
							placeholder="Пароль не требуется"
							class="disabled-password"
							disabled
						/>
					</div>
				</template>
			</Column>

			<Column style="width: 10%">
				<template #body="{ data }">
					<div class="action-container">
						<Button
							icon="pi pi-trash"
							class="p-button-danger"
							@click="userStore.deleteUser(data.id)"
						/>
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<style scoped>
.header {
	display: flex;
	align-items: center;
	gap: 1rem;
	margin-bottom: 1rem;
}

.table-container {
	margin-top: 1rem;
	width: 100%;
	overflow-x: auto;
}

.fixed-width-table {
	table-layout: fixed;
	width: 100%;
}

.input-container {
	width: 100%;
	padding: 0.25rem;
}

.action-container {
	display: flex;
	justify-content: center;
	width: 100%;
}

.p-inputtext,
.p-dropdown {
	width: 100% !important;
	margin-bottom: 0.25rem;
}

.p-invalid {
	border-color: #f44336 !important;
}

.disabled-password {
	cursor: not-allowed;
}
</style>
