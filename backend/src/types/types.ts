import { AppStatus, WorkLocation,Experience,Jobtype } from "@prisma/client"

import { string, z} from "zod"

export const signupSchema=z.object({
    name:z.string().min(3),
    role:z.enum(['USER', 'EMPLOYER', 'ADMIN']).optional(),
    email:z.string().email(),
    password:z.string().min(3)
})
export const SigninSchema=z.object({
    email:z.string().email(),
    password:z.string().min(5),
})
export const JobSchema=z.object({
    experience:z.nativeEnum(Experience),
    education:z.string().optional(),
    jobtype:z.nativeEnum(Jobtype),
    skills:z.array(string()).min(1, "At least one skill is required")
    .max(5, "Maximum 5 skills allowed"),
    title:z.string().min(3),
    content:z.string().min(3),
    salary:z.number(),
    workLocation :z.enum(['ONSITE','HYBRID','REMOTE'])
})
export const UpdateJobSchema=z.object({
    title:z.string().min(5).optional(),
    contact:z.string().min(5).optional(),
    content:z.string().min(10).optional(),
    salary:z.number().positive().optional(),
    workLocation :z.enum(['ONSITE','HYBRID','REMOTE']).optional()
})
export const UpdateEmployerProfileSchema=z.object({
    companyName :z.string().optional(),
    bio :z.string().optional(),
    companyType   :z.string().optional(),
    noEmployees:z.number().optional(),
    location  :  z.string().optional(),
    companyurl : z.string().optional(),
    photoUrl:z.string().optional()
})
export const UpdateUserProfileSchema=z.object({
    skills: z.array(z.string()).min(1).max(5),
    bio      : z.string(),
    location :z.string(),
    education :z.string()
})
export const JobFilterSchema = z.object({
  jobType: z.nativeEnum(Jobtype).optional(),
 
  experience: z.nativeEnum(Experience).optional(),
  salary:z.number().int().positive().optional(),
  education:z.string().optional(),
  workLocation: z.nativeEnum(WorkLocation).optional(),
  boost: z.boolean().optional(),
})
export const ApplicationSchema=z.object({
    jobId:z.number(),
    resumeUrl:z.string(),
    content:z.string()
})
export const UpdateApplicationSchema=z.object({
    status:z.nativeEnum(AppStatus) 
})