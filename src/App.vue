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
							@change="userStore.updateUser(data.id, { type: data.type })"
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
							@blur="userStore.validateUser(data)"
							placeholder="Введите логин"
							:class="{ 'p-invalid': data.errors.login }"
						/>
						<small v-if="data.errors.login" class="p-error">{{
							data.errors.login
						}}</small>
					</div>
				</template>
			</Column>

			<Column header="Пароль" style="width: 20%">
				<template #body="{ data }">
					<div class="input-container">
						<InputText
							v-model="data.password"
							type="password"
							@blur="userStore.validateUser(data)"
							:placeholder="
								data.type === 'LDAP' ? 'Пароль не требуется' : 'Введите пароль'
							"
							:class="{
								'p-invalid': data.errors.password,
								'disabled-password': data.type === 'LDAP',
							}"
							:disabled="data.type === 'LDAP'"
						/>
						<small v-if="data.errors.password" class="p-error">
							{{ data.errors.password }}
						</small>
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

.p-error {
	color: #f44336;
	font-size: 0.875rem;
}

.p-invalid {
	border-color: #f44336 !important;
}

.disabled-password {
	cursor: not-allowed;
}
</style>
