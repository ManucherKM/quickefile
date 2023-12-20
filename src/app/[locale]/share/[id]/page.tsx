'use client'

import { QRCode } from '@/components'
import { env } from '@/config/env'
import { useFileStore, useNotificationsStore } from '@/storage'
import { writeTextIntoClipboard } from '@/utils'
import { Button } from 'kuui-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import classes from './Share.module.scss'

export interface IShare {
	params: { id: string; locale: string }
}

const CLIENT_URL = env.get('CLIENT_URL').required().asString()

export default function Share({ params: { id, locale } }: IShare) {
	const newError = useNotificationsStore(store => store.newError)
	const newMessage = useNotificationsStore(store => store.newMessage)
	const t = useTranslations()

	const checkExistArchive = useFileStore(store => store.checkExistArchive)

	const router = useRouter()

	const url = `${CLIENT_URL}/${locale}/${id}`

	async function copyHandler() {
		try {
			await writeTextIntoClipboard(url)

			newMessage(t('link_copied_to_clipboard'))
		} catch (e) {
			newError(t('failed_to_copy_text_to_clipboard'))
		}
	}

	useEffect(() => {
		const fetchFile = async () => {
			try {
				const isSuccess = await checkExistArchive(id)

				if (!isSuccess) {
					newError(t('the_file_could_not_be_found'))
					router.push('/' + locale)
				}
			} catch (e) {
				newError(t('unexpected_server_error'))
				console.log(e)
			}
		}

		fetchFile()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		<div className={classes.root}>
			<QRCode link={url} />
			<span>{t('or')}</span>
			<Button onClick={copyHandler}>{t('copy_link')}</Button>
		</div>
	)
}