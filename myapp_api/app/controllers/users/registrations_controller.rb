class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource, store: false)
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end

  def respond_with(resource, _opts = {})
    if resource.persisted?
      render json: { user: { id: resource.id, email: resource.email } }, status: :created
    else
      render json: { errors: resource.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
