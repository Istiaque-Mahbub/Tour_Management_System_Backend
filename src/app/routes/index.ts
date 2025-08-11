import { Router } from "express"
import { UserRoutes } from "../modules/user/user.route"
import { AuthRoutes } from "../modules/auth/auth.route"
import { TourRoutes } from "../modules/tour/tour.route"
import { DivisionRoutes } from "../modules/division/division.route"
import { BookingRoutes } from "../modules/booking/booking.route"
import { PaymentRoutes } from "../modules/payment/payment.route"



export const router = Router()

const moduleRoutes = [
    {
        path:"/user",
        route: UserRoutes
    },
    {
        path:"/division",
        route:DivisionRoutes
    },
    {
        path:"/tour",
        route:TourRoutes
    },
    {
        path:"/booking",
        route:BookingRoutes
    },
    {
        path:"/payment",
        route:PaymentRoutes
    },
    {
        path:"/auth",
        route: AuthRoutes
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})