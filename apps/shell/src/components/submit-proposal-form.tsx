// 'use client';
// import { useCallback } from 'react';
// import { yupResolver } from '@hookform/resolvers/yup';
// import clsx from 'clsx';
// import Link from 'next/link';
// import { useForm, SubmitHandler } from 'react-hook-form';
// import { useNetwork } from 'wagmi';
// import * as Yup from 'yup';
// import { getChainParams } from '@haqq/data-access-cosmos';
// import {
//   ICreateTextProposalForm,
//   getFormattedAddress,
//   useProposalActions,
//   useSupportedChains,
//   useToast,
// } from '@haqq/shell-shared';
// import {
//   Button,
//   Container,
//   Heading,
//   LinkIcon,
//   ToastError,
//   ToastLoading,
//   ToastSuccess,
// } from '@haqq/shell-ui-kit';
// import { FormInputError } from './submit-proposal-su-form-keplr';

// const inputClassnames = clsx(
//   'inline-block w-full rounded-[6px] border border-white/20 bg-transparent px-[16px] py-[12px] text-[14px] leading-[22px] text-white placeholder-white/25 outline-none',
//   'transition-colors duration-150 ease-in will-change-[color,background]',
//   'focus:border-white/30 focus:bg-transparent focus:text-white',
//   'hover:border-white/10',
// );

// const submitTextProposalSchema = Yup.object({
//   title: Yup.string().required('Title is required'),
//   description: Yup.string().required('Description is required'),
//   initialDeposit: Yup.number()
//     .min(0, 'Deposit cannot be negative')
//     .required('Deposit is required'),
// }).required();

// const submitUpgradeProposalSchema = Yup.object({
//   title: Yup.string().required('Title is required'),
//   description: Yup.string().required('Description is required'),
//   initialDeposit: Yup.number()
//     .min(0, 'Initial deposit cannot be negative')
//     .required('Initial deposit is required'),
//   applyHeight: Yup.number()
//     .min(0, 'Apply height cannot be negative')
//     .required('Apply Height is required'),
//   planName: Yup.string().required('Plan name is required'),
//   plan: Yup.string()
//     .required('Plan is required')
//     .test('is-json', 'Upgrade plan must be valid JSON', (value: string) => {
//       try {
//         JSON.parse(value);
//         return true;
//       } catch (error) {
//         return false;
//       }
//     }),
// }).required();

// export function CreateTextProposalForm() {
//   const toast = useToast();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<ICreateTextProposalForm>({
//     resolver: yupResolver(submitTextProposalSchema),
//     defaultValues: {
//       title: 'Test proposal 32312323',
//       description:
//         'Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet aliquam minima sit quaerat! Repudiandae maxime rerum provident, repellat ipsa nesciunt doloribus nam facilis iure modi unde, odio, illo officia voluptatem.',
//       initialDeposit: 1,
//     },
//   });
//   const chains = useSupportedChains();
//   const { chain = chains[0] } = useNetwork();
//   const { explorer } = getChainParams(
//     chain.unsupported !== undefined && !chain.unsupported
//       ? chain.id
//       : chains[0].id,
//   );
//   const { submitTextProposal } = useProposalActions();

//   const handleSubmitProposal = useCallback(
//     async (data: ICreateTextProposalForm) => {
//       try {
//         const submitProposalPromise = submitTextProposal(data);

//         await toast.promise(submitProposalPromise, {
//           loading: <ToastLoading>Proposal submit in progress</ToastLoading>,
//           success: (tx) => {
//             console.log('Vote successful', { tx });
//             const txHash = tx?.txhash;

//             return (
//               <ToastSuccess>
//                 <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
//                   <div>Your vote will be counted!!!</div>
//                   <div>
//                     <Link
//                       href={`${explorer.cosmos}/tx/${txHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
//                     >
//                       <LinkIcon />
//                       <span>{getFormattedAddress(txHash)}</span>
//                     </Link>
//                   </div>
//                 </div>
//               </ToastSuccess>
//             );
//           },
//           error: (error) => {
//             console.error(error);
//             return <ToastError>For some reason your vote failed.</ToastError>;
//           },
//         });
//       } catch (error) {
//         console.error((error as Error).message);
//       }
//     },
//     [explorer.cosmos, submitTextProposal, toast],
//   );

//   const onFormSubmit: SubmitHandler<ICreateTextProposalForm> = (data) => {
//     handleSubmitProposal(data);
//   };

//   return (
//     <Container>
//       <div className="mx-auto mb-[32px] max-w-2xl transform-gpu flex-col gap-y-[32px] rounded-b-[8px] rounded-t-[8px] bg-[#ffffff14] p-[24px] lg:mb-[68px] lg:p-[32px]">
//         <div className="flex flex-col gap-[32px]">
//           <div>
//             <Heading level={3} className="mb-[-2px]">
//               Text proposal
//             </Heading>
//           </div>

//           <form onSubmit={handleSubmit(onFormSubmit)}>
//             <div className="flex flex-1 flex-col gap-[18px]">
//               <div className="flex flex-col gap-[8px]">
//                 <div>
//                   <label
//                     htmlFor="title"
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                   >
//                     Proposal title
//                   </label>
//                 </div>
//                 <div>
//                   <input
//                     className={inputClassnames}
//                     {...register('title')}
//                     type="text"
//                     id="title"
//                   />
//                 </div>

//                 {errors.title && <div>{errors.title.message}</div>}
//               </div>

//               <div className="flex flex-col gap-[8px]">
//                 <div>
//                   <label
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                     htmlFor="description"
//                   >
//                     Description
//                   </label>
//                 </div>
//                 <div>
//                   <input
//                     className={inputClassnames}
//                     {...register('description')}
//                     id="description"
//                     type="text"
//                   />
//                 </div>
//                 {errors.description && <div>{errors.description.message}</div>}
//               </div>

//               <div className="flex flex-1 flex-col gap-[8px]">
//                 <div>
//                   <label
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                     htmlFor="initialDeposit"
//                   >
//                     Initial Deposit
//                   </label>
//                 </div>
//                 <div>
//                   <input
//                     className={inputClassnames}
//                     {...register('initialDeposit')}
//                     id="initialDeposit"
//                     type="number"
//                   />
//                 </div>
//                 {errors.initialDeposit && (
//                   <div>{errors.initialDeposit.message}</div>
//                 )}
//               </div>

//               <div>
//                 <Button className="w-full" variant={2} type="submit">
//                   Submit proposal
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Container>
//   );
// }

// interface CreateUpgradeProposalForm {
//   title: string;
//   description: string;
//   initialDeposit: number;
//   applyHeight: number;
//   planName: string;
//   plan: string;
// }
// export function CreateUpgradeProposalForm() {
//   const toast = useToast();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CreateUpgradeProposalForm>({
//     resolver: yupResolver(submitUpgradeProposalSchema),
//   });
//   const chains = useSupportedChains();
//   const { chain = chains[0] } = useNetwork();
//   const { explorer } = getChainParams(
//     chain.unsupported !== undefined && !chain.unsupported
//       ? chain.id
//       : chains[0].id,
//   );
//   const { submitSuProposal } = useProposalActions();

//   const handleSubmitProposal = useCallback(
//     async (data: CreateUpgradeProposalForm) => {
//       try {
//         const submitProposalPromise = submitSuProposal(data);

//         await toast.promise(submitProposalPromise, {
//           loading: <ToastLoading>Proposal submit in progress</ToastLoading>,
//           success: (tx) => {
//             console.log('Vote successful', { tx });
//             const txHash = tx?.txhash;

//             return (
//               <ToastSuccess>
//                 <div className="flex flex-col items-center gap-[8px] text-[20px] leading-[26px]">
//                   <div>Your vote will be counted!!!</div>
//                   <div>
//                     <Link
//                       href={`${explorer.cosmos}/tx/${txHash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-haqq-orange hover:text-haqq-light-orange flex items-center gap-[4px] lowercase transition-colors duration-300"
//                     >
//                       <LinkIcon />
//                       <span>{getFormattedAddress(txHash)}</span>
//                     </Link>
//                   </div>
//                 </div>
//               </ToastSuccess>
//             );
//           },
//           error: (error) => {
//             console.error(error);
//             return <ToastError>For some reason your vote failed.</ToastError>;
//           },
//         });
//       } catch (error) {
//         console.error((error as Error).message);
//       }
//     },
//     [explorer.cosmos, submitSuProposal, toast],
//   );

//   const onFormSubmit: SubmitHandler<CreateUpgradeProposalForm> = (data) => {
//     handleSubmitProposal(data);
//   };

//   return (
//     <Container>
//       <div className="mx-auto mb-[32px] max-w-2xl transform-gpu flex-col gap-y-[32px] rounded-b-[8px] rounded-t-[8px] bg-[#ffffff14] p-[24px] lg:mb-[68px] lg:p-[32px]">
//         <div className="flex flex-col gap-[32px]">
//           <div>
//             <Heading level={3} className="mb-[-2px]">
//               Text proposal
//             </Heading>
//           </div>

//           <form onSubmit={handleSubmit(onFormSubmit)}>
//             <div className="flex flex-1 flex-col gap-[14px]">
//               <div className="flex flex-col gap-[6px]">
//                 <div>
//                   <label
//                     htmlFor="title"
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                   >
//                     Proposal title
//                   </label>
//                 </div>
//                 <div>
//                   <input
//                     className={inputClassnames}
//                     {...register('title')}
//                     type="text"
//                     id="title"
//                   />
//                 </div>

//                 <FormInputError error={errors.title?.message} />
//               </div>

//               <div className="flex flex-col gap-[6px]">
//                 <div>
//                   <label
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                     htmlFor="description"
//                   >
//                     Description
//                   </label>
//                 </div>
//                 <div className="leading-[0px]">
//                   <textarea
//                     className={clsx(inputClassnames, 'min-h-32 resize-none')}
//                     {...register('description')}
//                     id="description"
//                   />
//                 </div>
//                 <FormInputError error={errors.description?.message} />
//               </div>

//               <div className="flex flex-row gap-[16px]">
//                 <div className="flex flex-1 flex-col gap-[6px]">
//                   <div>
//                     <label
//                       className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                       htmlFor="initialDeposit"
//                     >
//                       Initial Deposit
//                     </label>
//                   </div>
//                   <div>
//                     <input
//                       className={inputClassnames}
//                       {...register('initialDeposit')}
//                       id="initialDeposit"
//                       type="number"
//                     />
//                   </div>
//                   <FormInputError error={errors.initialDeposit?.message} />
//                 </div>

//                 <div className="flex flex-1 flex-col gap-[6px]">
//                   <div>
//                     <label
//                       className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                       htmlFor="applyHeight"
//                     >
//                       Apply Height
//                     </label>
//                   </div>
//                   <div>
//                     <input
//                       className={inputClassnames}
//                       {...register('applyHeight')}
//                       id="applyHeight"
//                       type="number"
//                     />
//                   </div>
//                   <FormInputError error={errors.applyHeight?.message} />
//                 </div>
//               </div>

//               <div className="flex flex-col gap-[6px]">
//                 <div>
//                   <label
//                     htmlFor="planName"
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                   >
//                     Upgrade plan version
//                   </label>
//                 </div>
//                 <div>
//                   <input
//                     className={inputClassnames}
//                     {...register('planName')}
//                     type="text"
//                     id="planName"
//                   />
//                 </div>
//                 <FormInputError error={errors.planName?.message} />
//               </div>

//               <div className="flex flex-col gap-[6px]">
//                 <div>
//                   <label
//                     className="cursor-pointer text-[12px] font-[500] uppercase leading-[24px] text-white/50"
//                     htmlFor="plan"
//                   >
//                     Upgrade plan info
//                   </label>
//                 </div>
//                 <div className="leading-[0px]">
//                   <textarea
//                     className={clsx(inputClassnames, 'min-h-32 resize-none')}
//                     {...register('plan')}
//                     id="plan"
//                   />
//                 </div>
//                 <FormInputError error={errors.plan?.message} />
//               </div>

//               <div className="mt-[16px]">
//                 <Button className="w-full" variant={2} type="submit">
//                   Submit upgrade proposal
//                 </Button>
//               </div>
//             </div>
//           </form>
//         </div>
//       </div>
//     </Container>
//   );
// }
