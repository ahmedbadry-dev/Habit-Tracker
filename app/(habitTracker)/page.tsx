import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, Check, Clock, Flame, MoreVertical, Plus, TrendingUp, TrophyIcon } from 'lucide-react'

const page = () => {
  return (
    <div className='p-4 space-y-4'>
      <Card className='@container/card '>
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
          <div className='flex justify-between items-center p-2 bg-accent rounded-2xl '>
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
      <div className='py-6 mb-0'>
        <h1 className='py-6 p-4 text-2xl font-medium border-l-8 border-ring rounded-sm'>Quick Actions</h1>
        <div className='grid grid-cols-1 @xl:grid-cols-2  gap-4 py-6 lg:gap-6'>
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
          <Button className='flex items-center gap-2 py-2 px-4 cursor-pointer'>
            <Plus className='size-4' />
            <span className='text-xs md:text-sm'>Add Habits</span>
          </Button>
        </div>
      </div>

      {/* Habits */}
      <div
        className='py-6 space-y-6'
        style={{ "--habit-color": 'red' } as React.CSSProperties}>
        <Card>
          <CardContent className='flex flex-row gap-4'>
            {/* lift side */}
            <div className='w-10 h-10 bg-accent rounded-xl'>
            </div>

            {/* right side */}
            <div className='flex-1 space-y-4'>
              <div className='flex justify-between'>
                {/* top */}
                <div className='flex'>
                  {/* top-lift */}
                  <div>
                    <div className='flex gap-4 pb-1 '>
                      <h3 className='max-w-15 sm:max-w-40 md:max-w-80 text-sm md:text-base truncate'>Morning Meditation </h3>
                      <Badge className='text-xs text-muted-foreground' variant={'secondary'}>Wellness</Badge>
                    </div>
                    <p className='max-w-35 sm:max-w-70 text-xs text-muted-foreground truncate'>Start the day with mindfulness</p>
                  </div>
                </div>
                {/* top-right */}
                <div className='flex items-center'>
                  <Button variant={'ghost'} className='cursor-pointer'>
                    <MoreVertical className='size-4' />
                  </Button>
                  <Checkbox
                    // checked={habit.completed}
                    className="
                    rounded-full w-8 h-8
                    
                    
                    data-[state=checked]:bg-(--habit-color)!
                    data-[state=checked]:border-(--habit-color)
                  data-[state=checked]:text-white
                    "/>

                </div>
              </div>

              {/* progress bar */}
              <div className='space-y-1'>
                <div className="h-1.5 w-full rounded-full bg-muted ">
                  <div
                    className="h-full rounded-full"
                    style={{ width: "100%", backgroundColor: "var(--habit-color)" }}
                  />
                </div>
                <div className='flex justify-between'>
                  <p className='text-xs text-muted-foreground'>100% complete</p>
                  <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Clock className='size-3' />
                    <span>9:15 PM</span>
                  </div>
                </div>
              </div>

              {/* button card */}
              <div className='flex justify-between '>
                <Badge variant={'secondary'}>
                  <Flame className='size-4' />
                  <span>15 day streak</span>
                </Badge>

                <div className='flex items-center gap-1 text-primary'>
                  <Check className='size-4' />
                  <p className='text-xs'>Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardContent className='flex flex-row gap-4'>
            {/* lift side */}
            <div className='w-10 h-10 bg-accent rounded-xl'>
            </div>

            {/* right side */}
            <div className='flex-1 space-y-4'>
              <div className='flex justify-between'>
                {/* top */}
                <div className='flex'>
                  {/* top-lift */}
                  <div>
                    <div className='flex gap-4 pb-1 '>
                      <h3 className='max-w-15 sm:max-w-40 md:max-w-80 text-sm md:text-base truncate'>Morning Meditation </h3>
                      <Badge className='text-xs text-muted-foreground' variant={'secondary'}>Wellness</Badge>
                    </div>
                    <p className='max-w-35 sm:max-w-70 text-xs text-muted-foreground truncate'>Start the day with mindfulness</p>
                  </div>
                </div>
                {/* top-right */}
                <div className='flex items-center'>
                  <Button variant={'ghost'} className='cursor-pointer'>
                    <MoreVertical className='size-4' />
                  </Button>
                  <Checkbox
                    // checked={habit.completed}
                    className="
                    rounded-full w-8 h-8
                    
                    
                    data-[state=checked]:bg-(--habit-color)!
                    data-[state=checked]:border-(--habit-color)
                  data-[state=checked]:text-white
                    "/>

                </div>
              </div>

              {/* progress bar */}
              <div className='space-y-1'>
                <div className="h-1.5 w-full rounded-full bg-muted ">
                  <div
                    className="h-full rounded-full"
                    style={{ width: "100%", backgroundColor: "var(--habit-color)" }}
                  />
                </div>
                <div className='flex justify-between'>
                  <p className='text-xs text-muted-foreground'>100% complete</p>
                  <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                    <Clock className='size-3' />
                    <span>9:15 PM</span>
                  </div>
                </div>
              </div>

              {/* button card */}
              <div className='flex justify-between '>
                <Badge variant={'secondary'}>
                  <Flame className='size-4' />
                  <span>15 day streak</span>
                </Badge>

                <div className='flex items-center gap-1 text-primary'>
                  <Check className='size-4' />
                  <p className='text-xs'>Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

export default page
