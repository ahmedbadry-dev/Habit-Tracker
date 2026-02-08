import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, } from '@/components/ui/card'
import { Calendar, Plus, TrendingUp, TrophyIcon } from 'lucide-react'

const page = () => {
  return (
    <div className='p-1 md:p-4 space-y-4'>
      <Card className='@container/card'>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl @md:text-3xl @lg:text-5xl font-medium'>Good Morning!</h1>
            <Badge className='flex items-center gap-2 py-2 px-4'>
              <TrophyIcon className='size-4' />
              <span className='text-xs @md:text-sm'>12 Day Streak</span>
            </Badge>
          </div>
          <CardDescription className='flex items-center gap-2'>
            <Calendar className='size-4' />
            <span className='text-sm'>Sunday, February 8</span>
          </CardDescription>
        </CardHeader>

        {/* bg-linear-to-r from-chart-6 to-chart-7 */}
        <CardContent>
          <div className='flex justify-between items-center p-4 bg-accent rounded-2xl '>
            <div className='flex gap-4 @md:gap-6 items-center'>
              <div className='flex justify-center items-center w-20 h-20 text-base @md:w-25 @md:h-25 @md:text-xl font-bold rounded-full border-6 @md:border-8'>
                50%
              </div>
              <div>
                <p className='text-xl @md:text-2xl font-medium'>3 of 6 completed</p>
                <p className='text-muted-foreground'>50% completed</p>
              </div>
            </div>
            <TrendingUp />
          </div>
        </CardContent>
      </Card>
      {/* quick actions */}
      <div >
        <h1 className='py-6 p-4 text-2xl font-medium border-l-8 border-ring rounded-sm'>Quick Actions</h1>
        <div className='grid grid-cols-1 @xl:grid-cols-2  gap-4 p-4 lg:gap-6'>
          <Card className='gap-2'>
            <CardHeader >
              <div className='w-15 h-15 rounded-xl bg-accent'></div>
            </CardHeader>
            <CardContent >
              <p className='text-base'>Streak Boost</p>
              <p className='text-xs text-muted-foreground'>Maintain momentum</p>
            </CardContent>
          </Card>

          <Card className='gap-2'>
            <CardHeader >
              <div className='w-15 h-15 rounded-xl bg-accent'></div>
            </CardHeader>
            <CardContent >
              <p className='text-base'>Streak Boost</p>
              <p className='text-xs text-muted-foreground'>Maintain momentum</p>
            </CardContent>
          </Card>

          <Card className='gap-2'>
            <CardHeader >
              <div className='w-15 h-15 rounded-xl bg-accent'></div>
            </CardHeader>
            <CardContent >
              <p className='text-base'>Streak Boost</p>
              <p className='text-xs text-muted-foreground'>Maintain momentum</p>
            </CardContent>
          </Card>

          <Card className='gap-2'>
            <CardHeader >
              <div className='w-15 h-15 rounded-xl bg-accent'></div>
            </CardHeader>
            <CardContent >
              <p className='text-base'>Streak Boost</p>
              <p className='text-xs text-muted-foreground'>Maintain momentum</p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Today Habits */}
      <div >
        <div className='flex justify-between items-center pr-4'>
          <h1 className='py-6 p-4 text-2xl font-medium border-l-8 border-ring rounded-sm'>Today Habits</h1>
          <Badge className='flex items-center gap-2 py-2 px-4'>
            <Plus className='size-4' />
            <span className='text-xs md:text-sm'>Add Habits</span>
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default page
