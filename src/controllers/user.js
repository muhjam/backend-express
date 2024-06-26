const { StatusCodes } = require('http-status-codes');
const BaseResponse = require('../schemas/responses/BaseResponse');
const DataTable = require('../schemas/responses/DataTable');
const FindUsers = require('../services/user/findUser');
const ChangePassword = require('../services/user/change-password');
const forgotPass = require('../services/user/forgot-password');
const resetPassword = require('../services/user/reset-password');
const updateBiodata = require('../services/user/update-biodate');
const DeleteUser = require('../services/user/delete-user');
const { sponsor } = require('../services/user/test');

const GetAllUsers = async (req, res) => {
  try {
    const users = await FindUsers(req.query);
    res.status(StatusCodes.OK).json(new DataTable(users.data, users.total));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res
      .status(status)
      .json(
        new BaseResponse({
          status: status,
          message: error.message
        })
      )
  }
}

const ChangePasswordUser = async (req, res) => {
  try {
    await ChangePassword(req.body, res.locals.user);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Password berhasil diubah'
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }
}

const ForgotPassword = async (req, res) => {
  try {
    await forgotPass(req.body);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Email berhasil dikirim'
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }
}

const ResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      throw new Error('Token is missing');
    }
    const result = await resetPassword(token);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Token Validation Success',
      data: result
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }
}

const UpdateBiodateUser = async(req, res) => {
  try {
    const { id } = req.query;
    await updateBiodata(id, req.body, req.files);
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Biodata berhasil diubah'
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }
}

const DeleteUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log(`Received userId: ${userId}`);
    
    const result = await DeleteUser(userId);

    res.status(StatusCodes.OK).json(
      new BaseResponse({
        status: StatusCodes.OK,
        message: result.message,
      })
    );
  } catch (error) {
    console.error(`Error in DeleteUsers controller: ${error.message}`);
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }
};

const Test = async (req, res) => {
  try {
    const result = await sponsor();
    res.status(StatusCodes.OK).json(new BaseResponse({
      status: StatusCodes.OK,
      message: 'Success',
      data: result
    }));
  } catch (error) {
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    res.status(status).json(new BaseResponse({
      status: status,
      message: error.message
    }));
  }

}

module.exports = {
  GetAllUsers,
  ChangePasswordUser,
  ForgotPassword,
  ResetPassword,
  UpdateBiodateUser,
  DeleteUsers,
  sponsor
}
