import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { IoMdText } from "react-icons/io";
import { IoNewspaper } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { formatPostDate } from "../../utils/date";

const NotificationPage = () => {

	const queryClient = useQueryClient();
	const {data: notifications, isLoading} = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to fetch notifications");
				return data; 
			} catch (error) {
				throw new Error(error);
			}
		},
	});


	const {mutate: deleteNotifications} = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				})
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to delete notifications");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("All notifications deleted successfully!");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete notifications");
		},
		
	})

	const getNotificationText = (type) => {
		switch (type) {
			case "follow":
				return " followed you";
			case "like":
				return " liked your post";
			case "comment":
				return " commented on your post";
			default:
				return "";
		}
	}



	return (
		<>
			<div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
				<div className='flex justify-between items-center p-4 border-b border-gray-700'>
					<p className='font-bold'>Notifications</p>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='w-4' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
				{notifications?.map((notification) => (
				<div 
					className={`border-b border-gray-700 ${
						!notification.read ? "bg-blue-900/23" : ""
					}`} 
					key={notification._id}
				>
					<div className="flex gap-2 p-4 relative">
						
						{notification.type === "follow" && (
							<FaUser className="w-7 h-7 text-blue-500" />
						)}
						{notification.type === "like" && (
							<FaHeart className="w-7 h-7 text-red-500" />
						)}
						{notification.type === "comment" && (
							<IoMdText className="w-7 h-7 text-green-500" />
						)}
						
						<Link to={`/profile/${notification.from.username}`} className="flex flex-col">
							<div className="flex items-center gap-4">
								<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
									<img 
										src={notification.from.profileImg || "/avatar-placeholder.png"} 
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="text-gray-700">{formatPostDate(notification.createdAt)}</div>
							</div>
							<div className="flex gap-1">
								<span className="font-bold">@{notification.from.username}</span>
								{getNotificationText(notification.type)} 
							</div>
						</Link>
						{(notification.type === "comment" || notification.type === "like") && (
							<Link
								className="ml-auto"
								to={`/post/${notification.post}${notification.type === "comment" ? '?openComments=true' : ''}`}
							>
								<IoNewspaper className="w-12 h-12 text-gray-500 "/>
							</Link>
						)}

						
					</div>
					
				</div>
			))}
			</div>
			
		</>
	);
};
export default NotificationPage;