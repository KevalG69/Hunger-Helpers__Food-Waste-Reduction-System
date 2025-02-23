//Modules

//Models
const DonationPointModel = require("../models/Donation_Point.js");
//Middlewares

//Functions

const getAllDonationPoints = async (req, res) => {

    try {
        //query
        //extracting data
        const {state, city, limit = 10, page = 1,minCapacity,maxCapacity, sort ,order } = req.query;

        //query
        const query = {};

        //filling query
        if (state) query.state = state;
        if (city) query.city = city;
        if(minCapacity) query.capacity = {$gte: parseInt(minCapacity)};
        if(maxCapacity) query.capacity = {...query.capacity, $lte:parseInt(maxCapacity)};

        //sort option
        let sortO = {};

        if(sort)
        {
            order= order === "desc"?-1:1;
            sortO[sort]=order
        }

        //getting all donation points
        const donationPoints = await DonationPointModel.find(query)
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .sort(sortO);

        //count 
        const total = await DonationPointModel.countDocuments(query);

        //checking any donation points exist
        console.log(donationPoints)
        if(!donationPoints.length)
        {
            return res.status(404)
                    .json({
                        message:"No Donation Point FOUND",
                        success:false,
                        data:[],
                        total,
                        page,
                        limit
                    })
        }

        //if donation point exist
        res.status(200)
            .json({
                message:"Fetched All Donation Points",
                success:true,
                data:donationPoints,
                total,
                page,
                limit
            });
    }
    catch (error) {
        console.error(error);
        res.status(500)
            .json({
                message: "Failed To Fetch All Donation Points",
                success: false,
                error
            })
    }
}

const getDonationPointById = async(req,res)=>{
    try
    {
        //getting donation point id
        const { donatonPointId} = req.query;

        //finding donation point
        const donationPoint = await DonationPointModel.findById(donationPointId);

        //checking donation point exist
        if(!donationPoint)
        {
            return res.status(404)
                    .json({
                        message:"Donation Point NOT FOUND",
                        success:false,
                        data:null
                    })
        }

        //if donaton point exist
        res.status(200)
            .json({
                message:"Fetched Donation Point Successfully",
                success:true,
                data:donationPoint
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500) 
            .json({
                message:"Failed To Fetch Donation Point",
                success:false,
                error
            })
    }
}

const createDonationPoint = async (req,res)=>{

    try
    {
        //extracting Data
        const donationPointData = req.body;

        const donationPoint = new DonationPointModel(donationPointData);

        const SdonationPoint= await donationPoint.save();

        //activityLogger
        await activityLogger(req.user.id, "Created Donation Point", "post /donation-point/create", {
            Manager_Name: req.user.first_name,
            Manager_email:req.user.email,
            DonationPointId: SdonationPoint.id,
            DonationBoxName: SdonationPoint.name,
        })

        res.status(200)
                .json({
                    message:"Created Donation Point Successfully",
                    success:true,
                    PointId:SdonationPoint.id
                })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed to Create Donation Point",
                success:false,
                PointId:null,
                error
            })
    }


}

const updateDonationPoint = async (req,res)=>{

    try
    {
        //geting donation point id
        const {donationPointId} = req.query;
        const updatedDonationPoint = req.body;

        //checking if donatin point exist
        const donationPoint = await DonationPointModel.findById(donationPointId);


        if(!donationPoint)
        {
            return res.status(404)  
                    .json({
                        message:"Donation Point NOT FOUND",
                        success:false
                    })
        }

        
        const restrictedFields = ['createdAt','updatedAt'];

        restrictedFields.forEach(field => delete updatedData[field]);

        //if donaton point exist
        Object.assign(donationPoint,updatedDonationPoint);
        donationPoint.updatedAt = Date.now();

        await donationPoint.save();

         //activityLogger
         await activityLogger(req.user.id,"Donation Point Updated","donation-point/update/:id",{
            DonationPointId:donationPointId,
            DonationPointName:donationPoint.name,
            Manager_Email:req.user.email,
            Manager_firstName:req.user.first_name,
            Manager_lastName:req.user.last_name
        })

        //response
        res.status(200)
            .json({
                message:"Donation Point Updated Successfully",
                success:true,
                data:donationPoint
            })


    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed To Update Donation Point",
                success:false,
                data:null,
                error
            })
    }
}

const deleteDonationPoint = async(req,res)=>{
    try
    {
        //donation point id
        const {donationPointId} = req.query;

        const donationPoint = await DonationPointModel.findById(donationPointId);

        //if donation point not found
        if(!donationPoint)
        {
            return res.status(404)
                    .json({
                        message:"Donation Point NOT FOUND",
                        success:false
                    })
        }

        //if donation point Exist
        await DonationPointModel.findByIdAndDelete(donationPointId);

        //activityLogger
        await activityLogger(req.user.id, "Deleted Donation Point", "delete /donation-point/:id", {
            Manager_Name: req.user.first_name,
            Manager_email:req.user.email,
            DonationPointId: donationPoint.id,
            DonationBoxName: donationPoint.name,
        });

        res.status(200)
            .json({
                message:"Deleted Donation Point Successfully",
                success:true
            })
    }
    catch(error)
    {
        console.error(error);
        res.status(500)
            .json({
                message:"Failed To Delete Donation Point",
                success:false,
                error
            })
    }
}

module.exports = {
    getAllDonationPoints,
    getDonationPointById,

    createDonationPoint,
    updateDonationPoint,
    deleteDonationPoint
}