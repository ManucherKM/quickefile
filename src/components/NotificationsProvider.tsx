'use client'

import { useNotificationsStore } from '@/storage'
import type { INotification } from '@/storage/useNotificationsStore/types'
import { ENotificationVariant } from '@/storage/useNotificationsStore/types'
import type { FC, ReactNode } from 'react'
import { AlertError } from './AlertError'
import { AlertMessage } from './AlertMessage'
import { List } from './List'

export interface INotificationsProvider {
	children: ReactNode
}

export const NotificationsProvider: FC<INotificationsProvider> = ({
	children,
}) => {
	const notifications = useNotificationsStore(store => store.notifications)

	const removeNotification = useNotificationsStore(
		store => store.removeNotification,
	)

	function notificationTimeUp(notification: INotification) {
		removeNotification(notification)
	}

	return (
		<>
			<List
				arr={notifications}
				callback={n => {
					if (n.variant === ENotificationVariant.message) {
						return (
							<AlertMessage
								key={n.text}
								message={n.text}
								onTimeUp={() => notificationTimeUp(n)}
							/>
						)
					}

					if (n.variant === ENotificationVariant.error) {
						return (
							<AlertError
								key={n.text}
								error={n.text}
								onTimeUp={() => notificationTimeUp(n)}
							/>
						)
					}
				}}
			/>
			{children}
		</>
	)
}
