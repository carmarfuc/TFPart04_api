const { User, Orders_head, Orders_pos } = require("../db.js");
const { v4: uuidv4,validate } = require("uuid");
const {sendMail} = require('./mailProds.js');
/*
envio de ordenes por Body:
{
    currency:"ARS",
    email:mariano@gmail.com,
    orders:[
        {
            productId:"c461032e-bd5a-4271-aa46-e495ff3c0b36",
            description:"python",
            price:19
        },
        {
            productId:"a817a66a-636b-4fa8-a27f-90d5a75d830f",
            description:"javascript",
            price:10
        }
    ]
}
*/
async function createOrder(req,res){
   
    try{
        const order = await Orders_head.create({
            id:uuidv4(),
            date:Date(),
            status:"pending",
            currency:req.body.currency,
            userEmail:req.body.userEmail,
            total:req.body.orders.map(order=>order.price).reduce((a,b)=>a+b)
        })        
        
        req.body.orders.forEach(async (orden,i)=>{
            await Orders_pos.create({
                ordersHeadId:order.id,
                idProduct:orden.idProduct,
                description:orden.description,
                price:orden.price,
                position:i+1,
                cuantity:1
            })
        })
        
        const ventaOrder= {
            id:order.id,
            det:req.body.orders
        }
        
        sendMail("created", order.id);
        res.status(200).send('Creacion de Orden Exitosa')
    }catch(error){
        res.send(`Error: ${error}`)
    }
}

/*
Actualizar status de la orden

{orderId:"a817a66a-636b-4fa8-a27f-90d5a75d830f",status:"payed"}
*/
async function updateStateOrder(req,res){
    const { orderId, status } = req.body;
    
    sendMail("updated", req.body.orderId); 
    try{
        await Orders_head.update({orderId,status},{where:{id:orderId}})
        // sendMail("updated", req.body, );
        res.send("Se ha actualizdo el estados de la orden")
    }catch(error){res.send(`Error: ${error}`)}    
}

/*
obtener ordenes

http://localhost:3001/order/{ userEmail }
*/
async function getOrders(req, res) {
    const { userEmail } = req.params;
    try {
        const userByPk = await User.findByPk(userEmail, 
            { 
                include: [
                    { 
                        model: Orders_head, 
                        include: [
                            { model: Orders_pos }
                        ] 
                    }
                ] 
            })
        res.json(userByPk)
    }catch(error){res.send(`Error: ${error}`)}
}

/*
ver ordenes por status

http://localhost:3001/order/status
{status:"payed"}
*/
async function getOrdersByState(req, res){
    try{
        const OrdersByState = await Orders_head.findAll({where:{status:req.body.status},include:{model: Orders_pos}})
        res.send(OrdersByState)
    }catch(error){res.send(`Error: ${error}`)}
}

/*
obtener ordenes por id de orden

http://localhost:3001/order/getbyorder/{ orderId }
*/
async function getOrdersByOrderId(req, res) {
    const { orderId } = req.params;
    if(orderId && validate(orderId)){
        try {
            const orderByPk = await Orders_head.findByPk(orderId, 
                {include:[{model: Orders_pos}]})
            res.json(orderByPk)
        }catch(error){res.send(`Error: ${error}`)}
    }else{
        try {
            const orderByPk = await Orders_head.findAll(
                {include:[{model: Orders_pos}]})
            res.json(orderByPk)
        }catch(error){res.send(`Error: ${error}`)}
    }
}

module.exports= {
    createOrder,
    getOrders,
    updateStateOrder,
    getOrdersByState,
    getOrdersByOrderId
}