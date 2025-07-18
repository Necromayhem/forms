<script setup lang="ts">
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import { useUserStore } from './stores/userStore'
import type { Tag } from './types'

const userStore = useUserStore()

const getTagsString = (tags: Tag[]): string => {
	return tags.map((tag: Tag) => tag.text).join('; ')
}

const handleTagsUpdate = (id: number, value?: string) => {
	if (value !== undefined) {
		userStore.updateTags(id, value)
	}
}
</script>

<template>
	<div class="header">
		<h2>Учётные записи</h2>
		<Button icon="pi pi-plus" size="small" @click="userStore.addUser" />
	</div>

	<div v-if="userStore.users.length > 0" class="table-container">
		<DataTable :value="userStore.users" :paginator="true" :rows="10">
			<Column header="Метки">
				<template #body="{ data }">
					<InputText
						:modelValue="getTagsString(data.tags)"
						@update:modelValue="
							(value: string | undefined) => handleTagsUpdate(data.id, value)
						"
						@blur="userStore.validateUser(data)"
						placeholder="Введите метки через ;"
						:class="{
							'p-invalid': data.tags.some((tag: Tag) => tag.text.length > 50),
						}"
					/>
					<small
						v-if="data.tags.some((tag: Tag) => tag.text.length > 50)"
						class="p-error"
					>
						Максимум 50 символов на метку
					</small>
				</template>
			</Column>

			<Column header="Тип записи">
				<template #body="{ data }">
					<Dropdown
						v-model="data.type"
						:options="userStore.recordTypes"
						optionLabel="label"
						optionValue="value"
						@change="userStore.updateUser(data.id, { type: data.type })"
						placeholder="Выберите тип"
						:class="{ 'p-invalid': !data.type }"
					/>
				</template>
			</Column>

			<Column header="Логин">
				<template #body="{ data }">
					<InputText
						v-model="data.login"
						@blur="userStore.validateUser(data)"
						placeholder="Введите логин"
						:class="{ 'p-invalid': data.errors.login }"
					/>
					<small v-if="data.errors.login" class="p-error">{{
						data.errors.login
					}}</small>
				</template>
			</Column>

			<Column header="Пароль">
				<template #body="{ data }">
					<InputText
						v-model="data.password"
						type="password"
						@blur="userStore.validateUser(data)"
						placeholder="Введите пароль"
						:class="{ 'p-invalid': data.errors.password }"
						:disabled="data.type === 'LDAP'"
					/>
					<small v-if="data.errors.password" class="p-error">{{
						data.errors.password
					}}</small>
				</template>
			</Column>

			<Column header="Действия">
				<template #body="{ data }">
					<Button
						icon="pi pi-trash"
						class="p-button-danger"
						@click="userStore.deleteUser(data.id)"
					/>
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
}

.p-inputtext {
	margin-bottom: 0.25rem;
	width: 100%;
}

.p-error {
	color: #f44336;
	font-size: 0.875rem;
}

.p-invalid {
	border-color: #f44336 !important;
}
</style>
