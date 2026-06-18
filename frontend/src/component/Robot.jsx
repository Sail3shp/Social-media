import { InteractiveRobotSpline } from '@/components/blocks/interactive-3d-robot'

export function Section() { 
  
  const ROBOT_SCENE_URL = "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";

  return (
   
    <>

      <InteractiveRobotSpline
        scene={ROBOT_SCENE_URL}
        className="w-full h-full" 
      />
    </> 
  );
}
