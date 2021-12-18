exports.getResults = (req, res, next) => {
  try {
    req.models.Results.find({}, null, { sort: { _id: -1 } }, (error, results) => {
      if (error) return next(error)
      if (!results) return next(new Error('No results found.'))
      res.status(200).json(results)
    })
  } catch (error) {
    return next(error)
  }
}

exports.createResult = (req, res, next) => {
  try {
    const data = req.body
    req.models.Results.insertMany(data, function (err, doc) {
      if (err) return next(err)
      return res.status(200).json({ msg: 'Added succesfully', doc })
    })
  } catch (error) {
    next(error)
    res
      .status(err.status || 500)
      .json({ message: { msgBody: 'Error occured:' + err.message, msgError: true } })
  }


  // const {
  //   name,
  //   description,
  //   active
  // } = req.body

  // const service = {
  //   name,
  //   description,
  //   active,
  //   _createdBy: {
  //     creatorId: req.user._id
  //   }
  // }

  // const newService = new req.models.Service(service)
  // newService.save((err, results) => {
  //   if (err) return next(err)
  //   else
  //     return res.status(201).json({
  //       message: {
  //         msgBody: 'Service created succesfully.',
  //         msgError: false
  //       },
  //       doc: results
  //     })
  // })
}

exports.getResult = (req, res, next) => {
  const { id } = req.params
  req.models.Service.findById(id)
    .then(service => res.json(service))
    .catch(err => next(err))
}

exports.deleteResult = (req, res) => {
  const { id } = req.params
  req.models.Service.findByIdAndDelete(id)
    .then(() => res.json('Service deleted successfully.'))
    .catch(err => next(err))
}

exports.updateResult = (req, res, next) => {
  const { id } = req.params
  req.models.Service.findById(id)
    .then(service => {
      const {
        name,
        description,
        active
      } = req.body
      if (name) service.name = name
      if (description) service.description = description
      if (active) service.active = active

      service.save()
        .then(() =>
          res.status(201).json({
            message: {
              msgBody: 'Member updated succesfully.',
              msgError: false
            },
            doc: results
          })
        )
        .catch(err => next(err))
    })
    .catch(err => next(err))
}