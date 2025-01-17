const checarDias = (req, res, next) => {
    const date = new Date();
    const day = date.getDay();
    if(day === 0 || day === 6){
        res.status(403).json({message:"Acesso negado"});
    }else{
        next();
    }

};

export default checarDias;
