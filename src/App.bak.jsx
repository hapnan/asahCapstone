// import { AppSidebar } from '@/components/app-sidebar';
// import { ChartAreaInteractive } from '@/components/chart-area-interactive';
// import { DataTable } from '@/components/data-table';
// import { SectionCards } from '@/components/section-cards';
// import { SiteHeader } from '@/components/site-header';
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
// import data from './app/dashboard/data.json';
// import { ThemeProvider } from '@/components/theme-provider';
// export default function Page() {
//     return (
//         <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
//             <SidebarProvider
//                 style={{
//                     '--sidebar-width': '280px',
//                     '--header-height': '60px',
//                 }}
//                 className='min-h-screen w-full'
//             >
//                 <AppSidebar variant='inset' />
//                 <SidebarInset className='flex-1'>
//                     <SiteHeader />
//                     <div className='flex flex-1 flex-col w-full'>
//                         <div className='@container/main flex flex-1 flex-col gap-2 w-full'>
//                             <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6 w-full'>
//                                 <SectionCards />
//                                 <div className='px-4 lg:px-6 w-full'>
//                                     <ChartAreaInteractive />
//                                 </div>
//                                 <DataTable data={data} />
//                             </div>
//                         </div>
//                     </div>
//                 </SidebarInset>
//             </SidebarProvider>
//         </ThemeProvider>
//     );
// }
