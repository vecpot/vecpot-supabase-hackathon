import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface SDKCardProps {
  type: "python" | "javascript"
}

export default function SDKCard({ type }: SDKCardProps) {
  const contentByType = {
    python: {
      name: "Python",
      description: "Easily start with Python",
      docs: "",
      github: "",
      status: "alpha",
      statusVariant: "outline",
    },
    javascript: {
      name: "Javascript",
      description: "Easily start with Javascript or Typescript",
      docs: "",
      github: "",
      status: "comming soon",
      statusVariant: "secondary",
    },
  }

  const getVariant = (type: SDKCardProps["type"]): "secondary" | "outline" => {
    if (type === "javascript") {
      return "secondary"
    }
    return "outline"
  }

  const getIcons = (type: SDKCardProps["type"]) => {
    if (type === "python") {
      return <Icons.python className="mr-2 h-6 w-6" />
    } else if (type === "javascript") {
      return <Icons.javascript className="mr-2 h-6 w-6" />
    } else if (type === "curl") {
      return <Icons.python className="mr-2 h-6 w-6" />
    }
    return <></>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          {getIcons(type)}
          <span className="mr-2 font-bold">{contentByType[type].name}</span>
          <Badge variant={getVariant(type)}>{contentByType[type].status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="">
          <p className="mb-4 text-sm text-muted-foreground">
            {contentByType[type].description}
          </p>
          {type === "python" && (
            <>
              <Link
                href="https://github.com/vecpot/vecpot-python-sdk"
                target="_blank"
              >
                <Button className="mr-2" variant={"secondary"} size={"sm"}>
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  Github
                </Button>
              </Link>
              <Link
                href="https://github.com/vecpot/vecpot-python-sdk"
                target="_blank"
              >
                <Button className="mr-2" variant={"secondary"} size={"sm"}>
                  <Icons.file className="mr-2 h-4 w-4" />
                  Docs
                </Button>
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
