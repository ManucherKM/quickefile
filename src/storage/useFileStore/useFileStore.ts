import axios from '@/config/axios'
import { downloadFileFromBuffer } from '@/utils'
import { create } from 'zustand'
import type { IFileStore, ISendFilesRes } from './types'
import { EFileStoreApiRoutes } from './types'

/** With this hook you can access the file storage. */
export const useFileStore = create<IFileStore>(() => ({
	async sendFiles(files) {
		try {
			const formData = new FormData()

			for (const file of files) {
				formData.append('files', file)
			}

			const { data } = await axios.post<ISendFilesRes>(
				EFileStoreApiRoutes.sendFiles,
				formData,
			)

			return data.id
		} catch (e) {
			// We display the error in the console.
			console.error(e)

			// Return false.
			return 'asd'
		}
	},
	async downloadArchive(id) {
		try {
			const url = EFileStoreApiRoutes.downloadArchive + '/' + id

			const { data } = await axios.get<Buffer>(url, {
				responseType: 'arraybuffer',
			})

			downloadFileFromBuffer(data)

			return true
		} catch (e) {
			console.log(e)

			return false
		}
	},
}))
