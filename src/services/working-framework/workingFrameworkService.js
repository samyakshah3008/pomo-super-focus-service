import { workingFrameworkTemplates } from "../../constants.js";
import { WorkingFramework } from "../../models/working-framework.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getWorkingFrameworkService = async () => {
  let framework = await WorkingFramework.findOne();
  if (!framework) {
    framework = await WorkingFramework.create({
      templates: workingFrameworkTemplates,
    });
  }

  return new ApiResponse(
    201,
    { frameworkTemplates: framework.templates },
    "Successfully fetched working framework templates"
  );
};

export { getWorkingFrameworkService };
