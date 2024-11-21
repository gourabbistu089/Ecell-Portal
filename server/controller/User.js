const Startup = require("../models/Startup");
const EcellForm = require('../models/EcellForm')

const checkStartupRegistration = async (req, res) => {
    try {
        const {userId} = req.body;
        const existingStartup = await Startup.findOne({ user: userId });

        if (existingStartup) {
            return res.status(200).json({ registered: true,startup:existingStartup});
        } else {
            return res.status(200).json({ registered: false});
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


const registerStartup = async (req, res) => {
    try {
        let status=false  
        const { userId,title, teamMembers, idea, stage, phase, requirements, consent } = req.body;
        const newStartup = new Startup({
            title: title,
            teamMembers: teamMembers,
            idea: idea,
            stage: stage,
            phase: phase,
            requirements: requirements,
            consent: consent,
            user: userId
        });
        await newStartup.save().then(()=>{
            status = true;
            res.status(201).json({ message: "Startup registered successfully", startup: newStartup ,status});
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error", error });
    }
};

const getActiveForm = async (req, res) => {
    try {
      const currentDate = new Date();
      const forms = await EcellForm.find({isPublished: true,$or:[{endDate: {$gt: currentDate }},{endDate:null}]}).select('_id title description');
      res.status(200).json({ forms });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch forms' });
    }
  };

const getForm = async (req, res) => {
    try {
      const {formId}=req.body;
      const form = await EcellForm.find({_id:formId});
      res.status(200).json({ form });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch form' });
    }
  };
  

module.exports = { checkStartupRegistration, registerStartup,getActiveForm,getForm};
